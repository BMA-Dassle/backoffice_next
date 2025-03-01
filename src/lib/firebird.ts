import * as Firebird from "node-firebird";

const options: any = {};

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

export async function readBlob(blob: any): Promise<string> {
  return new Promise((resolve) => {
    blob(function (err: any, name: any, e: any) {
      const chunks: any = [];

      e.on("data", function (chunk: Buffer) {
        chunks.push(chunk);
      });

      e.on("end", function () {
        resolve(Buffer.concat(chunks).toString("utf-8"));
      });
    });
  });
}

export async function runQuery(center: string, query: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    options.host = center;

    const pool = Firebird.pool(5, options);

    setTimeout(() => reject("Rquest Timeout"), 60000);

    pool.get(function (err: any, db: any) {
      db.query(query, params, function (err: any, result: any) {
        if (err) {
          db.detach();
          reject(err);
        }

        db.detach();
        resolve(result);
      });
    });
  });
}

export async function runExecute(
  center: string,
  query: string,
  params: any[] = []
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    options.host = center;

    const pool = Firebird.pool(5, options);

    setTimeout(() => reject("Rquest Timeout"), 60000);

    pool.get(function (err: any, db: any) {
      db.execute(query, params, function (err: any, result: any) {
        if (err) {
          db.detach();
          reject(err);
        }

        db.detach();
        resolve(result);
      });
    });
  });
}
