const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log(`db ${connection.state}`);
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {

                const query = "SELECT * FROM names";
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async insertNewName(name) {
        try {
            const date_added = new Date();
            const insertId = await new Promise((resolve, reject) => {

                const query = "INSERT INTO names (name , date_added) VALUES (? , ?)";
                connection.query(query, [name, date_added], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                     console.log(result.insertId);
                })
            });

            return {
                id : insertId,
                name :name,
                date_added :date_added

            };

        } catch (error) {
            console.log(error);
        }
    }
async deleteRowById(id) {
    id = parseInt(id);

    try {
        const response = await new Promise((resolve, reject) => {

            const query = "DELETE FROM  names  WHERE id = ?";
            connection.query(query, [id], (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result.affectedRows);
                 console.log(result);
            })
        });

       return response  === 1  ? true : false;

    } catch (error) {
        console.log(error);
        return false;
    }
}

async updateNameById(id , name){
    id = parseInt(id);

    try {
        const response = await new Promise((resolve, reject) => {

            const query = "UPDATE   names  SET name =  ? WHERE id = ?";
            connection.query(query, [name , id], (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result.affectedRows);
                 console.log(result);
            })
        });

       return response  === 1  ? true : false;

    } catch (error) {
        console.log(error);
        return false;
    }
}


}



module.exports = DbService;
