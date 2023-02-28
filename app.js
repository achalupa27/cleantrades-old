// Imports
const express = require('express')
const path = require('path')
const app = express()
const port = 8000

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "user_data"
});

// Static Files
app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/images'))
app.use('/html', express.static(__dirname + 'public/html'))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/html/index.html'));
});

app.get('/trades-settings', function (req, res) {
    con.query("SELECT * FROM trades_settings", function (err, result) {
        if (err) throw err;
        console.info(`server:  settings ${result[0].trades_start}, ${result[0].trades_end} received from database`)
        res.send(result)
    });
});

app.get('/save-date-range', function (req, res) {
    con.query("UPDATE trades_settings SET trades_start = '" + req.query.tradesStart + "', trades_end = '" + req.query.tradesEnd + "'", function (err, result) {
        if (err) throw err;
        console.info(`server: date change ${req.query.tradesStart} to ${req.query.tradesEnd} saved to database`)
        res.send("success");
    });
});

app.get('/trades', function (req, res) {
    con.query("SELECT * FROM trades_settings", function (err, result) {
        if (err) throw err;
        con.query("SELECT * FROM trades WHERE STR_TO_DATE(entry_date, '%b %e %Y') BETWEEN STR_TO_DATE('" + result[0].trades_start + "', '%b %e %Y') AND STR_TO_DATE('" + result[0].trades_end + "', '%b %e %Y') ORDER BY STR_TO_DATE(entry_date, '%b %e %Y') DESC, STR_TO_DATE(entry_time, '%h:%i:%s') DESC", function (err, trades) {
            if (err) throw err;
            console.info(`server: trades in range ${result[0].trades_start} - ${result[0].trades_end} received from database`)
            res.send(trades)
        });
    });
});

app.get('/get-first-trade-date', function (req, res) {
    con.query("SELECT entry_date AS min_date from trades order by STR_TO_DATE(entry_date, '%b %e %Y') ASC limit 1", function (err, result) {
        if (err) throw err;
        console.info(`server: first trade date - ${result[0].min_date} - received from database`)
        res.send(result)
    });
});

var columnChange;
var valueChange;
app.get('/save-trade', function (req, res) {
    if (req.query.id === '') req.query.id = null;

    if (req.query.rowChanges != null) {
        columnChange = "(id, " + Object.keys(req.query.rowChanges).join(', ') + ")"
        valueChange = "(" + req.query.id + ", '" + Object.values(req.query.rowChanges).join("', '") + "')"

        updateFields = [];
        for (const [key, value] of Object.entries(req.query.rowChanges)) {
            updateFields.push(key + " = " + "'" + value + "'");
        }
        updateQuery = updateFields.join(', ');
        query = "INSERT INTO trades " + columnChange + " VALUES " + valueChange + " ON DUPLICATE KEY UPDATE " + updateQuery;

        console.log(query)

        con.query(query, function (err, result) {
            if (err) throw err;
            con.query("SELECT * FROM trades_settings", function (err, result) {
                if (err) throw err;
                con.query("SELECT * FROM trades WHERE STR_TO_DATE(entry_date, '%b %e %Y') BETWEEN STR_TO_DATE('" + result[0].trades_start + "', '%b %e %Y') AND STR_TO_DATE('" + result[0].trades_end + "', '%b %e %Y') ORDER BY STR_TO_DATE(entry_date, '%b %e %Y') DESC, STR_TO_DATE(entry_time, '%h:%i:%s') DESC", function (err, trades) {
                    if (err) throw err;
                    console.info(`server: trades in range ${result[0].trades_start} - ${result[0].trades_end} received from database`)
                    res.send(trades)
                });
            });
            console.info(`trade saved / edited`)
        });
    }
});

app.get('/import-trades', function (req, res) {

});

app.get('/delete-trade', function (req, res) {
    con.query("DELETE FROM trades WHERE id=" + req.query.deleteID + ";", function (err, result) {
        if (err) throw err;
        con.query("SELECT * FROM trades_settings", function (err, result) {
            if (err) throw err;
            con.query("SELECT * FROM trades WHERE STR_TO_DATE(entry_date, '%b %e %Y') BETWEEN STR_TO_DATE('" + result[0].trades_start + "', '%b %e %Y') AND STR_TO_DATE('" + result[0].trades_end + "', '%b %e %Y') ORDER BY STR_TO_DATE(entry_date, '%b %e %Y') DESC, STR_TO_DATE(entry_time, '%h:%i:%s') DESC", function (err, trades) {
                if (err) throw err;
                console.info(`server: trades in range ${result[0].trades_start} - ${result[0].trades_end} received from database`)
                res.send(trades)
            });
        });
        console.info(`server: trade with id - ${req.query.deleteID} - deleted from database`)
    });
});

app.listen(port, () => console.info(`app listening on port ${port}`))