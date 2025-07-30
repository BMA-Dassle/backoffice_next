import * as Firebird from "node-firebird";

let options: any = {};

options.port = 3050;
options.database = "c:\\fast\\fast.fdb";
options.user = "SYSDBA";
options.password = "masterkey";
options.lowercase_keys = false; // set to true to lowercase keys
options.role = null; // default
options.pageSize = 4096; // default when creating database
options.retryConnectionInterval = 5000; // reconnect interval in case of connection drop
options.blobAsText = false; // set to true to get blob as text, only affects blob subtype 1
options.encoding = "UTF-8";

const poolMap = new Map<string, Firebird.ConnectionPool>();

async function createPool(ip: string) {
  console.log("NEW POOL");
  options.host = ip;

  var pool = Firebird.pool(5, options);

  if (poolMap.get(ip)) {
    poolMap.get(ip)!.destroy();
    poolMap.delete(ip);
  }

  poolMap.set(ip, pool);
}

async function getPoolValue(ip: string): Promise<Firebird.ConnectionPool> {
  if (!poolMap.get(ip)) {
    await createPool(ip);
  }

  return poolMap.get(ip)!;
}

export async function readBlob(blob: any): Promise<string> {
  return new Promise((resolve) => {
    blob(function (err: any, name: any, e: any) {
      if (err) throw err;
      console.log("Blob name: " + name);
      let chunks: any = [];
      console.log("Reading blob...");

      e.on("data", function (chunk: Buffer) {
        console.log("Reading chunk of blob...");
        chunks.push(chunk);
      });

      e.on("end", function () {
        resolve(Buffer.concat(chunks).toString("utf-8"));
      });
    });
  });
}

export async function runQuery(center: string, query: string, params: any[] = []): Promise<any[]> {
  return new Promise(async (resolve, reject) => {
    var pool = await getPoolValue(center);

    setTimeout(() => reject("Rquest Timeout"), 60000);

    pool.get(function (err: any, db: any) {
      try {
        db.query(query, params, function (err: any, result: any) {
          if (err) {
            db.detach();
            reject(err);
          }

          db.detach();
          resolve(result);
        });
      } catch {
        reject("Error with DB");
      }
    });
  });
}

export async function runExecute(
  center: string,
  query: string,
  params: any[] = []
): Promise<any[]> {
  return new Promise(async (resolve, reject) => {
    var pool = await getPoolValue(center);

    setTimeout(() => reject("Rquest Timeout"), 60000);

    pool.get(function (err: any, db: any) {
      try {
        db.execute(query, params, function (err: any, result: any) {
          if (err) {
            db.detach();
            reject(err);
          }

          db.detach();
          resolve(result);
        });
      } catch {
        reject("Error with DB");
      }
    });
  });
}

export async function runQueryWithBlob(
  center: string,
  query: string,
  params: any[] = []
): Promise<any[]> {
  return new Promise(async (resolve, reject) => {
    var pool = await getPoolValue(center);

    setTimeout(() => reject("Rquest Timeout"), 60000);

    pool.get(function (err: any, db: any) {
      try {
        db.transaction(Firebird.ISOLATION_READ_COMMITTED, (err: any, transaction: any) => {
          if (err) {
            throw err;
          }

          transaction.query(query, params, async (err: any, result: any) => {
            if (err) {
              transaction.rollback();
              db.detach();
              reject(err);
            }

            const arrBlob = [];
            for (const item of result) {
              const fields = Object.keys(item);
              for (const key of fields) {
                if (typeof item[key] === "function") {
                  item[key] = new Promise((resolve, reject) => {
                    // the same transaction is used (better performance)
                    // this is optional
                    item[key](transaction, (error: any, name: any, event: any, row: any) => {
                      if (error) {
                        return reject(error);
                      }

                      // reading data
                      let value = "";
                      event.on("data", (chunk: any) => {
                        value += chunk.toString("binary");
                      });
                      event.on("end", () => {
                        resolve({ value, column: name, row });
                      });
                    });
                  });
                  arrBlob.push(item[key]);
                }
              }
            }

            Promise.all(arrBlob)
              .then((blobs) => {
                for (const blob of blobs) {
                  result[blob.row][blob.column] = blob.value;
                }

                transaction.commit((err: any) => {
                  if (err) {
                    transaction.rollback();
                    db.detach();
                    reject(err);
                  }

                  db.detach();
                  resolve(result);
                });
              })
              .catch((err) => {
                transaction.rollback();
                db.detach();
                reject(err);
              });
          });
        });
      } catch {
        reject("Error with DB");
      }
    });
  });
}
