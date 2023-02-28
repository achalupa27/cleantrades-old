function insertNewTrade() {
    var table = document.getElementById("tradesTable");
    document.getElementById("tradesScroll").scrollTop = 0;

    var newRow = table.insertRow(1);
    newRow.className = "trade-row";

    const spans = [
        "<span id='id' name='id' style='display:none'></span><span id='ticker' name='ticker' spellcheck='false' style='$color'></span>",
        "<span id='direction' name='direction'></span>",
        "<span id='period' name='period'></span>",
        "<span id='bigPictureTF' name='big_picture_tf'></span>",
        "<span id='bigPicturePlay' name='big_picture_play'></span>",
        "<span id='intradayTF' name='intraday_tf'></span>",
        "<span id='intradayPlay' name='intraday_play'></span>",
        "<span id='entryDate' name='entry_date'></span>",
        "<span id='entryTime' name='entry_time'></span>",
        "<span id='exitDate' name='exit_date'></span>",
        "<span id='exitTime' name='exit_time'></span>",
        "<span id='entryPrice' name='entry_price'></span>",
        "<span id='stopLoss' name='stop_loss'></span>",
        "<span id='exitPrice' name='exit_price'></span>",
        "<span id='shares' name='shares'></span>",
        "<span id='commission' name='commission'></span>",
        "<span id='slippage' name='slippage'></span>",
        "<span id='netDollars' name='net_dollars' style='$color'></span>",
        `<div>
            <span id='netR' name='net_r' style='$color'></span>
        </div>
        <div class='row-actions' id='row-actions'>
            <div class='edit-row row-button' id='edit-row'>
                <i class='fi fi-rr-pencil'></i>
            </div>
            <div class='delete-row row-button'>
                <i class='fi fi-rr-trash'></i>
            </div>
        </div>`
    ];
    var newCell;
    for (var i = 0; i < 19; i++) {
        newCell = newRow.insertCell(i);
        newCell.innerHTML = spans[i];
    }

    return newRow;
}

var rowData = {};
var newRowData = {};

function editTrade(editRow) {
    var currentSpan = editRow.find('span');
    $.each(currentSpan, function () {
        rowData[$(this)[0].getAttribute("name")] = $(this).text();
    });

    showEditActions(editRow);

    currentSpan[1].focus();
    currentSpan[1].style.textTransform = 'uppercase';
}

function saveTrade(editRow) {
    hideEditActions(editRow);
    editRow.find("#entryDate")[0].innerHTML = document.getElementById('entryInput').value;
    editRow.find("#exitDate")[0].innerHTML = document.getElementById('exitInput').value;

    entryPrice = parseFloat(editRow.find('#entryPrice')[0].innerHTML);
    exitPrice = parseFloat(editRow.find('#exitPrice')[0].innerHTML);
    stopLoss = parseFloat(editRow.find('#stopLoss')[0].innerHTML);
    shares = parseFloat(editRow.find('#shares')[0].innerHTML);
    slippage = parseFloat(editRow.find('#slippage')[0].innerHTML);
    commission = parseFloat(editRow.find('#commission')[0].innerHTML);

    if (isNaN(slippage)) slippage = 0;
    if (isNaN(commission)) commission = 0;

    risk = Math.abs((entryPrice - stopLoss) * shares).toFixed(2);
    if (entryPrice > stopLoss && entryPrice != '' && stopLoss != '') {
        editRow.find("#direction")[0].innerHTML = "Long";

        netDollars = (((exitPrice - entryPrice) * shares) - slippage - commission).toFixed(2);
        editRow.find("#netDollars")[0].innerHTML = netDollars;

        netR = (netDollars / risk).toFixed(1);
        editRow.find("#netR")[0].innerHTML = netR;
    }
    else if (entryPrice < stopLoss && entryPrice != '' && stopLoss != '') {
        editRow.find("#direction")[0].innerHTML = "Short";

        netDollars = (((entryPrice - exitPrice) * shares) - slippage - commission).toFixed(2);
        editRow.find("#netDollars")[0].innerHTML = netDollars;

        netR = (netDollars / risk).toFixed(1);
        editRow.find("#netR")[0].innerHTML = netR;
    } else {
        editRow.find("#direction")[0].innerHTML = '';
        editRow.find("#netDollars")[0].innerHTML = '';
        editRow.find("#netR")[0].innerHTML = '';
    }

    // Store the values of the spans in newRowData
    var currentSpan = editRow.find('span');
    $.each(currentSpan, function () {
        newRowData[$(this)[0].getAttribute("name")] = $(this).text();
    });

    if (parseInt($(this).attr('netDollars')) > 0) {
        editRow.find("#ticker")[0].style.color = "#22ab81";
        editRow.find("#netDollars")[0].style.color = "#22ab81";
        editRow.find("#netR")[0].style.color = "#22ab81";
    } else {
        editRow.find("#ticker")[0].style.color = "#ff6581";
        editRow.find("#netDollars")[0].style.color = "#ff6581";
        editRow.find("#netR")[0].style.color = "#ff6581";
    }

    delete rowData.net_r;
    delete rowData.net_dollars;
    delete newRowData.net_r;
    delete newRowData.net_dollars;

    const getDifference = (a, b) =>
        Object.fromEntries(Object.entries(b).filter(([key, val]) => key in a && a[key] !== val));

    const rowChanges = getDifference(rowData, newRowData);
    // don't pass changes to net_r or net_dollars
    console.log(rowChanges);
    var id = editRow.find("#id")[0].innerHTML;
    console.log(id);

    $.ajax({
        type: "GET",
        url: "/save-trade",
        data: {
            'id': id,
            'rowChanges': rowChanges
        },
        success: function (response) {
            getStats(response);
        }
    });

    editRow.find("#commission")[0].style.color = "#888";
    editRow.find("#slippage")[0].style.color = "#888";

    editRow = null;
}

function getDifference(array1, array2) {
    return array1.filter(object1 => {
        return !array2.some(object2 => {
            return object1.id === object2.id;
        });
    });
}

function cancelTrade(editRow) {
    hideEditActions(editRow);
    let checkCount = 0;
    let emptyCount = 0;
    var currentSpan = editRow.find('span');
    $.each(currentSpan, function () {
        //Return the cells to prior data
        $(this)[0].innerHTML = rowData[$(this)[0].getAttribute('name')]

        //Remove row if all cells are undefined

        if ($(this).attr('id') != 'direction' && $(this).attr('id') != 'netDollars' && $(this).attr('id') != 'netR' &&
            $(this).attr('id') != 'id' && $(this).attr('id') != 'entryDate' && $(this).attr('id') != 'exitDate') {
            checkCount++;
            if ($(this)[0].innerHTML == "") {
                emptyCount++;
            }
        }

        if ($(this).attr('id') == 'commission' || $(this).attr('id') == 'slippage') {
            $(this)[0].style.color = "#888";
        }
    });

    if (parseInt($(this).attr('netDollars')) > 0) {
        editRow.find("#ticker")[0].style.color = "#22ab81";
        editRow.find("#netDollars")[0].style.color = "#22ab81";
        editRow.find("#netR")[0].style.color = "#22ab81";
    } else {
        editRow.find("#ticker")[0].style.color = "#ff6581";
        editRow.find("#netDollars")[0].style.color = "#ff6581";
        editRow.find("#netR")[0].style.color = "#ff6581";
    }

    if (checkCount == emptyCount) {
        editRow.remove();
    }

    editRow = null;
}

function showEditActions(editRow) {
    document.getElementById("cancelTrade").style.display = "block";
    document.getElementById("saveTrade").style.display = "block";
    document.getElementById("new-trade-button").style.display = "none";

    editRow.find(".row-actions")[0].style.visibility = 'hidden';

    var currentTD = editRow.find('td');
    $.each(currentTD, function () {
        $(this)[0].style.background = '#fff8e4';
        $(this)[0].style.padding = '3px 4px';
    });

    var date = moment().format('MMM D YYYY');

    var currentSpan = editRow.find('span');
    $.each(currentSpan, function () {
        $(this)[0].style.color = 'black';

        if ($(this).attr('id') != 'direction' && $(this).attr('id') != 'netDollars' && $(this).attr('id') != 'netR') {
            $(this).prop('contenteditable', true);
        } else {
            $(this)[0].innerHTML = "<i class='fi fi-rr-check'></i>";
        }

        if ($(this).attr('id') == 'entryDate') {
            if ($(this)[0].innerHTML != null) {
                date = $(this)[0].innerHTML;
            }
            $(this)[0].style.border = 'none';
            $(this)[0].innerHTML = "<input id='entryInput' name='entry-date' type='text' value='" + date + "' readonly='readonly'/>";
        }
        if ($(this).attr('id') == 'exitDate') {
            if ($(this)[0].innerHTML != null) {
                date = $(this)[0].innerHTML;
            }
            $(this)[0].style.border = 'none';
            $(this)[0].innerHTML = "<input id='exitInput' name='exit-date' type='text' value='" + date + "' readonly='readonly'/>";
        }
    });

    $(function () {
        $('input[name="entry-date"]').daterangepicker({
            "singleDatePicker": true,
            "autoApply": true,
            "locale": {
                "format": "MMM D YYYY"
            }
        });
    });

    $(function () {
        $('input[name="exit-date"]').daterangepicker({
            "singleDatePicker": true,
            "autoApply": true,
            "locale": {
                "format": "MMM D YYYY"
            }
        });
    });

    var currentTD = editRow.find('input');
    $.each(currentTD, function () {
        $(this)[0].style.background = '#fff8e4';
        $(this)[0].style.padding = '3px 4px';
        $(this)[0].style.border = '1px solid #eceef3';
        $(this)[0].style.borderRadius = '4px';
        $(this)[0].style.width = '100px';
        $(this)[0].style.textAlign = 'center';
        $(this)[0].style.fontWeight = '300';
    });

}

function hideEditActions(editRow) {
    document.getElementById("cancelTrade").style.display = "none";
    document.getElementById("saveTrade").style.display = "none";
    document.getElementById("new-trade-button").style.display = "block";

    editRow.find("#row-actions")[0].style.visibility = 'visible';

    var currentTD = editRow.find('td');
    $.each(currentTD, function () {
        $(this)[0].style.background = '';
        $(this)[0].style.padding = '8px 4px';
    });

    var currentSpan = editRow.find('span');
    $.each(currentSpan, function () {
        $(this).prop('contenteditable', false);
    });

    var currentTD = editRow.find('input');
    $.each(currentTD, function () {
        $(this)[0].style.background = '#fff';
        $(this)[0].style.padding = '3px 4px';
        $(this)[0].style.border = '1px solid #eceef3';
        $(this)[0].style.borderRadius = '4px';
        $(this)[0].style.width = '100px';
        $(this)[0].style.textAlign = 'center';
        $(this)[0].style.fontWeight = '300';
    });
}

function drawTable(data) {
    $("#tradesData").html("");
    for (var i = 0; i < data.length; i++) {
        drawRow(data[i]);
    }
}

function getExposure(trade) {
    return trade.entry_price * trade.shares
}

function getFees(trade) {
    return trade.commission + trade.slippage
}

function getStopSize(trade) {
    return Math.abs(trade.entry_price - trade.stop_loss)
}

function getRisk(trade) {
    return getStopSize(trade) * trade.shares
}

function getGrossDollars(trade) {
    if (trade.direction == "Long")
        return ((trade.exit_price - trade.entry_price) * trade.shares)
    else
        return ((trade.entry_price - trade.exit_price) * trade.shares)
}

function getNetDollars(trade) {
    return (getGrossDollars(trade) - getFees(trade))
}

function getGrossR(trade) {
    return getGrossDollars(trade) / getRisk(trade)
}

function getNetR(trade) {
    return (getNetDollars(trade) / getRisk(trade))
}

function getGrossPercent(trade) {
    return getGrossDollars(trade) / getExposure(trade) * 100
}

function getNetPercent(trade) {
    return getNetDollars(trade) / getExposure(trade) * 100
}

function getBestNetWin(trades) {
    return Math.max.apply(Math, trades.map(o => getNetDollars(o)))
}

function getWorstNetLoss(trades) {
    return Math.min.apply(Math, trades.map(o => getNetDollars(o)))
}

function getTicker(trade) {
    return (trade.ticker === null) ? '' : trade.ticker;
    if (trade.ticker == null) return '';
    else return trade.ticker;
}

function getDirection(trade) {
    return (trade.direction === null) ? '' : trade.direction;
    if (trade.direction == null) return '';
    else return trade.direction;
}

function getPeriod(trade) {
    return (trade.period === null) ? '' : trade.period;
    if (trade.period == null) return '';
    else return trade.period;
}

function getBigPictureTF(trade) {
    return (trade.big_picture_tf === null) ? '' : trade.big_picture_tf;
    if (trade.big_picture_tf == null) return '';
    else return trade.big_picture_tf;
}

function getBigPicturePlay(trade) {
    if (trade.big_picture_play == null) return '';
    else return trade.big_picture_play;
}

function getIntradayTF(trade) {
    if (trade.intraday_tf == null) return '';
    else return trade.intraday_tf;
}

function getIntradayPlay(trade) {
    if (trade.intraday_play == null) return '';
    else return trade.intraday_play;
}

function getEntryDate(trade) {
    if (trade.entry_date == null) return '';
    else return trade.entry_date;
}

function getEntryTime(trade) {
    if (trade.entry_time == null) return '';
    else return trade.entry_time
}

function getExitDate(trade) {
    if (trade.exit_date == null) return '';
    else return trade.exit_date;
}

function getExitTime(trade) {
    if (trade.exit_time == null) return '';
    else return trade.exit_time
}

function getEntryPrice(trade) {
    if (trade.entry_price == null) return '';
    else return trade.entry_price;
}

function getStopLoss(trade) {
    if (trade.stop_loss == null) return '';
    else return trade.stop_loss;
}

function getExitPrice(trade) {
    if (trade.exit_price == null) return '';
    else return trade.exit_price;
}

function getShares(trade) {
    if (trade.shares == null) return '';
    else return trade.shares;
}

function getCommission(trade) {
    if (trade.commission == null) return '';
    else return trade.commission;
}

function getSlippage(trade) {
    if (trade.slippage == null) return '';
    else return trade.slippage;
}

function isWin(trade) {
    if (getNetDollars(trade) >= 0) return true;
    else return false;
}

function getNumTradeDays(trades) {
    return new Set(trades.map(o => o.entry_date)).size;
}

// each trade is an object

function drawRow(trade) {
    var row = $("<tr class='trade-row'/>")
    $("#tradesData").append(row);

    if (getNetDollars(trade) > 0)
        color = "color:#22ab81;";
    else
        color = "color:#ff6571";

    row.append($("<td><span id ='id' name='id' style='display:none'>" + trade.id + "</span><span id='ticker' name='ticker' spellcheck='false' style='" + color + "'>" + getTicker(trade) + "</span></td>"));
    row.append($("<td><span id='direction' name='direction'>" + getDirection(trade) + "</span></td>"));
    row.append($("<td><span id='period' name='period'>" + getPeriod(trade) + "</td>"));
    row.append($("<td><span id='bigPictureTF' name='big_picture_tf'>" + getBigPictureTF(trade) + "</span></td>"));
    row.append($("<td><span id='bigPicturePlay' name='big_picture_play'>" + getBigPicturePlay(trade) + "</span></td>"));
    row.append($("<td><span id='intradayTF' name='intraday_tf'>" + getIntradayTF(trade) + "</span></td>"));
    row.append($("<td><span id='intradayPlay' name='intraday_play'>" + getIntradayPlay(trade) + "</span></td>"));
    row.append($("<td><span id='entryDate' name='entry_date'>" + getEntryDate(trade) + "</span></td>"));
    row.append($("<td><span id='entryTime' name='entry_time'>" + getEntryTime(trade) + "</span></td>"));
    row.append($("<td><span id='exitDate' name='exit_date'>" + getExitDate(trade) + "</span></td>"));
    row.append($("<td><span id='exitTime' name='exit_time'>" + getExitTime(trade) + "</span></td>"));
    row.append($("<td><span id='entryPrice' name='entry_price'>" + getEntryPrice(trade) + "</span></td>"));
    row.append($("<td><span id='stopLoss' name='stop_loss'>" + getStopLoss(trade) + "</span></td>"));
    row.append($("<td><span id='exitPrice' name='exit_price'>" + getExitPrice(trade) + "</span></td>"));
    row.append($("<td><span id='shares' name='shares'>" + getShares(trade) + "</span></td>"));
    row.append($("<td><span id='commission' name='commission'>" + getCommission(trade) + "</span></td>"));
    row.append($("<td><span id='slippage' name='slippage'>" + getSlippage(trade) + "</span></td>"));
    row.append($("<td><span id='netDollars' name='net_dollars' style='" + color + "'>" + getNetDollars(trade).toFixed(2) + "</span></td>"));
    row.append($("<td class='col-v-last'><span id='netR' name='net_r' style='" + color + "'>" + getNetR(trade).toFixed(1) + "</span><div class='row-actions' id='row-actions'><div class='edit-row row-button' id='editTrade'><i class='fi fi-rr-pencil'></i></div><div class='delete-row row-button' id='deleteTrade'><i class='fi fi-rr-trash'></i></div></div></td>"));
}

function drawColumns() {
}


function getStats(trades) {
    $('#tradesStats').html('');
    var numTrades = trades.length;
    var bestNetWin = getBestNetWin(trades);
    var worstNetLoss = getWorstNetLoss(trades);
    var totalGrossDollars = 0;
    var totalNetDollars = 0;
    var totalGrossR = 0;
    var totalNetR = 0;
    var totalGrossPercent = 0;
    var totalNetPercent = 0;

    var wins = 0, totalWinNetDollars = 0, totalWinGrossDollars = 0, totalWinNetR = 0, totalWinGrossR = 0, totalWinNetPercent = 0, totalWinGrossPercent = 0;
    var losses = 0, totalLossNetDollars = 0, totalLossGrossDollars = 0, totalLossNetR = 0, totalLossGrossR = 0, totalLossNetPercent = 0, totalLossGrossPercent = 0;
    trades.map(trade => {
        totalGrossDollars += getGrossDollars(trade);
        totalNetDollars += getNetDollars(trade);
        totalGrossR += getGrossR(trade);
        totalNetR += getNetR(trade);
        totalGrossPercent += getGrossPercent(trade);
        totalNetPercent += getNetPercent(trade);

        if (getNetDollars(trade) >= 0) {
            wins++;
            totalWinNetDollars += getNetDollars(trade);
        } else {
            losses++;
            totalLossNetDollars += getNetDollars(trade);
        }

        if (getGrossDollars(trade) >= 0)
            totalWinGrossDollars += getGrossDollars(trade);
        else
            totalLossGrossDollars += getGrossDollars(trade);


        if (getNetR(trade) >= 0)
            totalWinNetR += getNetR(trade);
        else
            totalLossNetR += getNetR(trade);


        if (getGrossR(trade) >= 0)
            totalWinGrossR += getGrossR(trade);
        else
            totalLossGrossR += getGrossR(trade);


        if (getNetPercent(trade) >= 0)
            totalWinNetPercent += getNetPercent(trade);
        else
            totalLossNetPercent += getNetPercent(trade);


        if (getGrossPercent(trade) >= 0)
            totalWinGrossPercent += getGrossPercent(trade);
        else
            totalLossGrossPercent += getGrossPercent(trade);
    });

    var avgNetWin = 0, avgGrossWin = 0;
    if (wins != 0) {
        avgNetWin = totalWinNetDollars / wins;
        avgGrossWin = totalWinGrossDollars / wins;
    }

    var avgNetLoss = 0, avgGrossLoss = 0;
    if (losses != 0) {
        avgNetLoss = totalLossNetDollars / losses;
        avgGrossLoss = totalLossGrossDollars / losses;
    }

    var totalAverageNetDollars = 0, totalAverageNetR = 0, totalAverageNetPercent = 0;
    var totalAverageGrossDollars = 0, totalAverageGrossR = 0, totalAverageGrossPercent = 0;
    if (trades != 0) {
        totalAverageNetDollars = totalNetDollars / numTrades;
        totalAverageNetR = totalNetR / numTrades;
        totalAverageNetPercent = totalNetPercent / numTrades;
        totalAverageGrossDollars = totalGrossDollars / numTrades;
        totalAverageGrossR = totalGrossR / numTrades;
        totalAverageGrossPercent = totalGrossPercent / numTrades;
    }

    var accuracy = 0;
    if (numTrades != 0)
        accuracy = ((wins / numTrades) * 100).toFixed(0);

    var netSharpe = 0;
    if (avgNetLoss != 0) {
        netSharpe = (avgNetWin / avgNetLoss).toFixed(2);
    }

    var grossSharpe = 0;
    if (avgGrossLoss != 0) {
        grossSharpe = avgGrossWin / avgGrossLoss;
    }

    netProfitRatio = accuracy * netSharpe / 100;
    grossProfitRatio = accuracy * grossSharpe / 100;

    totalNetDollars = totalNetDollars.toFixed(2)
    totalNetR = totalNetR.toFixed(2)

    var tooltip = "data-bs-custom-class='custom-tooltip' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-html='true'"
    var tradesStat = `<div class='trade-stat' ${tooltip} title='<b>Trades</b><br>Trading Days: ${getNumTradeDays(trades)}'>
                        <label class='selection'>T ${numTrades}</label>
                    </div>`
    var winsStat = `<div class='trade-stat' ${tooltip} title='<b>Wins</b><br>Average: ${avgNetWin}<br> Best: ${bestNetWin}<br> Total $: ${totalWinNetDollars}<br> Total R: ${totalWinNetR}'>
                        <label>W 
                            <label style='color:#22ab81'>${wins}</label>
                        </label>
                    </div>`
    var lossesStat = `<div class='trade-stat'" ${tooltip} title='<b>Losses</b><br>Average: ${avgNetLoss}<br> Worst: ${worstNetLoss}<br> Total $: ${totalLossNetDollars}<br> Total R: ${totalLossNetR}'>
                        <label>L 
                            <label style='color:#ff6581'>${losses}</label>
                        </label>
                    </div>`
    var accuracyStat = `<div class='trade-stat' ${tooltip} title = '<b>Batting Average</b>' >
                            <label>A ${accuracy}%</label>
                        </div>`
    var sharpeStat = `<div class='trade-stat' ${tooltip} title='<b>Sharpe Ratio</b>'>
                        <label>P ${netSharpe}</label>
                    </div>`
    var dollarStat = `<div class='trade-stat' ${tooltip} title = '<b>Profit</b><br>Gross: ${totalGrossDollars}<br> Net: ${totalNetDollars}<br> Average: ${totalAverageNetDollars}' >
                        <label>$ ${totalNetDollars}</label>
                    </div >`
    var rStat = `<div class='trade-stat' ${tooltip} title='<b>R</b><br>Gross: ${totalGrossR}<br> Net: ${totalNetR}<br> Average: ${totalAverageNetR}'>
                    <label>R ${totalNetR}</label>
                </div>`

    $('#tradesStats').html(tradesStat + winsStat + lossesStat + accuracyStat + sharpeStat + dollarStat + rStat);
}

function loadTradesActivity() {
    $('.activity__container').load("../html/activities/trades.html");

    getFirstTradeDate()
    loadTradesData();
}

function loadTradesData() {
    $.ajax({
        type: "GET",
        url: "/trades",
        success: function (response) {
            drawTable(response)
            getStats(response)
        }
    });
}

function getFirstTradeDate() {
    $.ajax({
        type: "GET",
        url: "/get-first-trade-date",
        success: function (response) {
            loadDatePicker(response[0].min_date);
        }
    });
}

function loadDatePicker(firstTradeDate) {
    $.ajax({
        type: "GET",
        url: "/trades-settings",
        success: function (response) {
            $(function () {
                $('input[name="report-picker"]').daterangepicker({
                    drops: 'up',
                    startDate: response[0].trades_start,
                    endDate: response[0].trades_end,
                    maxDate: moment(),
                    locale: {
                        "format": "MMM D YYYY"
                    },
                    ranges: {
                        'This Week': [moment().startOf('week'), moment()],
                        'This Month': [moment().startOf('month'), moment()],
                        'This Quarter': [moment().startOf('quarter'), moment()],
                        'This Year': [moment().startOf('year'), moment()],
                        'Last Year': [moment().startOf('year').subtract(1, 'year'), moment().endOf('year').subtract(1, 'year')],
                        'All Time': [firstTradeDate, moment()],
                    }

                }, function cb(start, end) {
                    $.ajax({
                        type: "GET",
                        url: "/save-date-range",
                        data: {
                            tradesStart: start.format('MMM D YYYY'),
                            tradesEnd: end.format('MMM D YYYY')
                        },
                        success: function (response) {
                            loadTradesData()
                        }
                    });
                });
            });
        }
    });
}

$(document).ready(function () {
    $('.activity-bar__container').load("../html/activities/activities-bar.html");
    $('.chart-bar__container').load("../html/chart/chart-action-bar.html");
    $('.watchlist').load("../html/watchlist/watchlist.php");
    $('.infocard').load("../html/infocard/infocard.html");

    loadTradesActivity();

    // --------------------------------------------------- Table Row Actions (200 lines) -----------------------------------------
    var editRow;

    $(document).on('click', '#new-trade-button', function () {
        editRow = $(insertNewTrade());
        editTrade(editRow);
    });

    $(document).on('click', '#editTrade', function () {
        if (editRow != null) {
            hideEditActions(editRow);
        }
        editRow = $(this).closest("tr");
        editTrade(editRow);
    });

    $(document).on('click', '#saveTrade', function () {
        saveTrade(editRow);
    });

    $(document).on('click', '#cancelTrade', function () {
        cancelTrade(editRow);
    });

    var deleteID;
    var deleteRow;
    $(document).on('click', '#deleteTrade', function () {
        deleteRow = $(this).closest('tr');
        deleteID = deleteRow.find('#id')[0].innerHTML;
        $('#confirm-delete-trade').modal('show');
    });

    $(document).on('click', '#yes-delete-trade', function () {
        $.ajax({
            type: "GET",
            url: "/delete-trade",
            data: {
                'deleteID': deleteID,
            },
            success: function (response) {
                getStats(response);
            }
        });

        deleteRow.remove();
        $('#confirm-delete-trade').modal('hide');
    });

    var selectedRow;
    //Open trade in chart
    $(document).on('click', '.trade-row td:not(.col-v-last)', function () {
        if (editRow == null) {
            if (selectedRow != null) {
                selectedRow[0].style.background = "";
                var currentTD = selectedRow.find('td');
                $.each(currentTD, function () {
                    $(this)[0].style.boxShadow = '';
                    $(this)[0].style.borderBottom = '';
                });
                selectedRow.find("#entryPrice")[0].style.color = "#000";
                selectedRow.find("#stopLoss")[0].style.color = "#000";
                selectedRow.find("#exitPrice")[0].style.color = "#000";
            }

            selectedRow = $(this).closest('tr');
            selectedRow.find("#entryPrice")[0].style.color = "#0084ff";
            selectedRow[0].style.background = " #f4faff";
            selectedRow.find("#stopLoss")[0].style.color = " #980000";
            if (parseInt(selectedRow.find("#netDollars")[0].innerHTML) > 0) {
                selectedRow.find("#exitPrice")[0].style.color = " #22ab81";
            } else {
                selectedRow.find("#exitPrice")[0].style.color = " #ff6581";
            }

            var currentTD = selectedRow.find('td');
            $.each(currentTD, function () {
                $(this)[0].style.boxShadow = '0 -1px 0 #0084ff';
                $(this)[0].style.borderBottom = '1px solid #0084ff';
            });

            var ticker = selectedRow.find('#ticker')[0].textContent;
            var entryDate = (new Date(selectedRow.find('#entryDate')[0].textContent)).toISOString().split('T')[0];
            var exitDate = (new Date(selectedRow.find('#exitDate')[0].textContent)).toISOString().split('T')[0];
            console.log("entryDate: " + entryDate + "exitDate: " + exitDate)

            document.getElementById("currentTicker").textContent = ticker;
            if (entryDate != null && exitDate != null) {
                poliQuery = "https://api.polygon.io/v2/aggs/ticker/" + ticker + "/range/1/minute/" + entryDate + "/" + exitDate + "?adjusted=true&sort=asc&apiKey=pu3ADzxEE14kpLulqkJEZgCyG3uF74P3"
                drawChart(poliQuery);
            }
        }
    })
    // ------------------------------------------------ Chart Action Bar -----------------------------------------------------
    $(document).bind('keydown', function (e) {
        // Letter is pressed
        if (editRow == null) {
            if (e.keyCode >= 65 && e.keyCode <= 90) {
                document.getElementById("symbolInput").style.display = 'block';
                document.getElementById("tickerInput").focus();
            }

            if (e.keyCode == 13 && document.getElementById("symbolInput").style.display == "block") {
                document.getElementById("symbolInput").style.display = 'none';
                document.getElementById("currentTicker").textContent = document.getElementById('tickerInput').value.toUpperCase();
                document.getElementById('tickerInput').value = '';

                let tickerQuery = document.getElementById("currentTicker").textContent.toUpperCase();
                poliQuery = "https://api.polygon.io/v2/aggs/ticker/" + tickerQuery + "/range/1/day/2020-07-22/2022-07-22?adjusted=true&sort=asc&apiKey=pu3ADzxEE14kpLulqkJEZgCyG3uF74P3"
                drawChart(poliQuery);
            }

            // Number is pressed
            if (e.keyCode >= 49 && e.keyCode <= 57) {

            }
        }
    });

    //Timeframe Switching
    $(document).on('click', '.tf', function () {
        let tf = this.id;
        tfData = tf.split("-");

        let tickerQuery = document.getElementById("currentTicker").textContent;
        poliQuery = "https://api.polygon.io/v2/aggs/ticker/" + tickerQuery + "/range/" + tfData[0] + "/" + tfData[1] + "/2020-07-22/2022-07-22?adjusted=true&sort=asc&apiKey=pu3ADzxEE14kpLulqkJEZgCyG3uF74P3"
        drawChart(poliQuery);

        var x = document.getElementsByClassName("selected-tf");
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove('selected-tf');
        }
        document.getElementById(tf).classList.add('selected-tf');
    });

    // ---------------------------------------------------------- Activity Bar ----------------------------------------------------

    // Activity Bar Navigation
    $(document).on('click', '.tab', function () {
        let activity = this.id;
        var activityLink = activity.replace('Tab', '');

        $('.activity__container').load('./html/activities/' + activityLink + '.html');
        var x = document.getElementsByClassName("selected-activity");
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove('selected-activity');
        }
        document.getElementById(activity).classList.add('selected-activity');
    });

    // Import trades from csv
    $(document).on('submit', '#import-trades-form', function (e) {
        e.preventDefault();

        let reader = new FileReader();
        const selectedFile = document.getElementById('import-file').files[0];

        reader.readAsText(selectedFile);
        reader.onload = function () {
            var file = reader.result;
            $.ajax({
                type: "POST",
                url: "/import-trades",
                data: { 'file': file },
                success: function (response) {
                    $('#import-trades-modal').modal('hide');
                }
            });
        };
    });

    // Bootstrap hover effect
    $(function () {
        'use strict'
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.forEach(function (tooltipTriggerEl) {
            new bootstrap.Tooltip(tooltipTriggerEl)
        })
    });

    // Resize Sections
    const resizable = function (resizer) {
        const direction = resizer.getAttribute('data-direction') || 'horizontal';
        const prevSibling = resizer.previousElementSibling;
        const nextSibling = resizer.nextElementSibling;

        // The current position of mouse
        let x = 0;
        let y = 0;
        let prevSiblingHeight = 0;
        let prevSiblingWidth = 0;

        // Handle the mousedown event
        // that's triggered when user drags the resizer
        const mouseDownHandler = function (e) {
            // Get the current mouse position
            x = e.clientX;
            y = e.clientY;
            const rect = prevSibling.getBoundingClientRect();
            prevSiblingHeight = rect.height;
            prevSiblingWidth = rect.width;


            // Attach the listeners to `document`
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);

            // Change the cursor while being pressed and dragged
            const cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
            resizer.style.cursor = cursor;
            document.body.style.cursor = cursor;

            // Make sure it doesn't select(highlight) text when dragging up/down
            prevSibling.style.userSelect = 'none';
            nextSibling.style.userSelect = 'none';

            // Make sure cursor style doesn't change when dragging over area
            prevSibling.style.pointerEvents = 'none';
            nextSibling.style.pointerEvents = 'none';
        };

        const mouseMoveHandler = function (e) {
            // How far the mouse has been moved
            const dx = e.clientX - x;
            const dy = e.clientY - y;

            // Resize the previous sibling
            if (direction == 'vertical') {
                const h = ((prevSiblingHeight + dy) * 100) / resizer.parentNode.getBoundingClientRect().height;
                prevSibling.style.height = `${h}%`;
            }
            else {
                const w = ((prevSiblingWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
                prevSibling.style.width = `${w}%`;
            }
            // Change the cursor while being dragged
            const cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
            resizer.style.cursor = cursor;
            document.body.style.cursor = cursor;

            // Make sure it doesn't select(highlight) text when dragging up/down
            prevSibling.style.userSelect = 'none';
            nextSibling.style.userSelect = 'none';

            // Make sure cursor style doesn't change when dragging over area
            prevSibling.style.pointerEvents = 'none';
            nextSibling.style.pointerEvents = 'none';
        };

        const mouseUpHandler = function () {
            resizer.style.removeProperty('cursor');
            document.body.style.removeProperty('cursor');

            prevSibling.style.removeProperty('user-select');
            prevSibling.style.removeProperty('pointer-events');

            nextSibling.style.removeProperty('user-select');
            nextSibling.style.removeProperty('pointer-events');

            // Remove the handlers of `mousemove` and `mouseup`
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        // Attach the handler
        resizer.addEventListener('mousedown', mouseDownHandler);
    };

    // Query all resizers
    document.querySelectorAll('.resizer').forEach(function (ele) {
        resizable(ele);
    });

    // New Trade Date Picker (Entry)
    $(function () {
        $('input[name="entry-date"]').daterangepicker({
            "singleDatePicker": true,
            "autoApply": true,
            "locale": {
                "format": "MMM D, YYYY"
            }
        });
    });

    // New Trade Date Picker (Exit)
    $(function () {
        $('input[name="exit-date"]').daterangepicker({
            "singleDatePicker": true,
            "autoApply": true,
            "locale": {
                "format": "MMM D, YYYY"
            }
        });
    });

    showTime();
    console.log('document ready');
});

poliQuery = "https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2020-10-30/2022-09-30?adjusted=true&sort=asc&apiKey=pu3ADzxEE14kpLulqkJEZgCyG3uF74P3"
function drawChart(poliQuery) {
    axios.get(poliQuery).then(resp => {
        barData = resp.data.results;
        //console.log(barData);

        //Clear the container    
        d3.select("#container").selectAll("*").remove();

        // Declare the dimensions and margins of the chart
        var chartBarHeight = 36;
        var yAxisWidth = 30;
        var xAxisHeight = 20;
        const w = document.getElementById('container__chart').offsetWidth - yAxisWidth;
        const h = document.getElementById('container__chart').offsetHeight - xAxisHeight - chartBarHeight;

        //Set the width and height of the svg chart container
        //append the svg object to the body of the page
        var svg = d3.select("#container")
            .attr("width", w + yAxisWidth)
            .attr("height", h + xAxisHeight)
            .append("g");

        // Map the dates in the dataset to an array, converting from UNIX MSEC to JS Date
        let dates = barData.map(bar => bar.t);

        // ----- X-AXIS -----

        // The min and max dates in the dataset
        var xmin = d3.min(barData.map(bar => bar.t));
        var xmax = d3.max(barData.map(bar => bar.t));

        // Initially load bars at default size
        // defaultWidth = 5px
        // # of bars to load = chartWidth / (defaultWidth + bandPadding) - marginRight

        // dates.length = 498
        // domain [-1, 498]
        // domain = Array(499)
        // dataset = Array(498)

        var defaultBarWidth = 5;

        // Create x-scale
        var xScale = d3.scaleTime()
            .domain([0, dates.length])
            .rangeRound([0, dates.length * (defaultBarWidth + 1)]);

        // Divide the x-scale into bands
        let xBand = d3.scaleBand()
            .domain(d3.range(0, dates.length))
            .rangeRound([0, dates.length * (defaultBarWidth + 1)])
            .padding(0.1);

        // d3.range returns an array of evenly spaced numbers within the specified range
        // so d3.range(-1, dates.length)
        // = [-1, 0, 1, 2 ... 498]
        // = Array(499)

        // Add x scale to x-axis
        var xAxis = d3.axisBottom()
            .scale(xScale)
            .tickSize(0);

        // Add x-axis to svg chart
        var gX = svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis);


        // ---------------- Y-AXIS ------------------
        var ymin = d3.min(barData.map(bar => bar.l));
        var ymax = d3.max(barData.map(bar => bar.h));

        // Create y scale
        var yScale = d3.scaleLinear()
            .domain([ymin, ymax])
            .range([h, 0])
            .nice();

        // Add y scale to y-axis
        var yAxis = d3.axisRight()
            .scale(yScale)
            .tickSize(0);

        // Add y-axis to svg chart
        var gY = svg.append("g")
            .attr("class", "axis y-axis")
            .attr("cursor", "ns-resize")
            .attr("transform", "translate(" + w + ", 0)")
            .call(yAxis);
        // ----------------------------------------------


        // ----- CHART BODY -----

        // Create chart body group element
        var chartBody = svg.append("g")
            .attr("class", "chartBody")
            .attr("clip-path", "url(#clip)");

        // Draw candlestick bodies
        let candles = chartBody.selectAll(".candle-body")
            .data(barData)
            .enter()
            .append("rect")
            .attr("class", "candle")
            .attr('x', (d, i) => xScale(i) - xBand.bandwidth())
            .attr('y', d => Math.round(yScale(Math.max(d.o, d.c))))
            .attr('width', xBand.bandwidth())
            .attr('height', d => (d.o === d.c || Math.round(yScale(Math.min(d.o, d.c))) - Math.round(yScale(Math.max(d.o, d.c))) === 0) ? 1 : Math.round(yScale(Math.min(d.o, d.c))) - Math.round(yScale(Math.max(d.o, d.c))))
            .attr("fill", d => (d.o === d.c) ? "silver" : (d.o > d.c) ? "#ff6571" : "#22ab81");

        // Draw candlestick wicks
        let wicks = chartBody.selectAll("g.candle-wick")
            .data(barData)
            .enter()
            .append("line")
            .attr("class", "wick")
            .attr("x1", (d, i) => xScale(i) - xBand.bandwidth() / 2)
            .attr("x2", (d, i) => xScale(i) - xBand.bandwidth() / 2)
            .attr("y1", d => Math.round(yScale(d.h)))
            .attr("y2", d => Math.round(yScale(d.l)))
            .attr("stroke", d => (d.o === d.c) ? "white" : (d.o > d.c) ? "#ff6571" : "#22ab81");

        // Clip path: everything outside of this area won't be drawn
        svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", w)
            .attr("height", h);

        // Zoom listener
        svg.append("rect")
            .attr("width", w)
            .attr("height", h)
            .style("fill", "none")
            .style("pointer-events", "all");

        // Chart zoom
        var zoom = d3.zoom()
            .scaleExtent([0.1, 100])
            .translateExtent([[-w / 2, 0], [w - 3, h]])
            .extent([[0, 0], [0, h]])
            .on("zoom", chartZoom);

        svg.call(zoom);
        var xDateScale = d3.scaleQuantize().domain([0, dates.length]).range(dates);


        /* 
            Draw chart from right:
            Need to translate entire chart left, including x axis and then adjust y axis
                Draw chart, then translate:
                    Translate x-axis
                    Translate bars
                    Adjust y-axis
                    Translate all indicators

                    1000 total bars
                    200 fit on screen: 
                    Initial = 0-200
                    Move left 800 bars = 800-1000
                    Right margin = 3 bars
                    Want to show 803-1000+rm(3)
                    So move left 803 bars
                    = Width of all bars - width of screen + right bar margin
                    = (barData.length * bandWidth) - w + rightBarMargin
                    = 1000 - 200 + 3
                    = 803
        */


        /*
            Fix zoom scaling:
            Zoom can be whatever, just need to make sure x position of candle wick is correct.
            Find under what conditions it is incorrect, and under what conditions it is correct
            
            Correct:

            Incorrect:

            Also gets messed up on translate, this probably has to do with zoom function updating x value incorrectly
        */


        /*
            Zoom to right side:

        */


        /* 
            To Fix x scale try:
            Convert domain to [xmin, xmax], see if you can emit points with no data

            Figure out how to make custom tickFormat
        */


        /*
            Fix y scale:
            yAxisWidth = tick width, + padding 
        */


        /*
            Crosshair:
            Needs to lock to x axis increments
            Free on y axis
            Show price and date
        */


        /*
            Remove double click to zoom:

        */


        /*
            Proper x axis bounds
        */


        /*
            Decide on y axis bounds
        */


        /*
            Add zoom to x axis:
            Change cursor on x axis
        */


        /*
            Add zoom to y axis:
            Change cursor on y axis
        */


        /*
            Chart volume:
            Need to draw another histogram over the chart at the bottom
        */


        /*
            Chart indicators:
            Need to draw another line chart over the chart at a custom y axis
        */

        /*
            Chart information:
            Need to draw a div over the chart at the top left
        */


        /*
            Type letter to open ticker select:
        */



        function chartZoom(event) {
            var newX = event.transform.rescaleX(xScale);

            // Update the x-axis
            gX.call(d3.axisBottom(newX).tickSize(0));

            // Get min and max dates in newly zoomed scale
            var xmin = new Date(xDateScale(Math.floor(newX.domain()[0])));
            var xmax = new Date(xDateScale(Math.floor(newX.domain()[1])));

            // Get the bar data within the min and max dates on newly zoomed scale
            filtered = _.filter(barData, d => ((d.t >= xmin) && (d.t <= xmax)));
            //<line class="wick" x1="373.5" x2="373.5" y1="326" y2="370" stroke="#22ab81"></line>
            //<rect class="candle" x="369" y="331" width="7" height="11" fill="#22ab81"></rect>
            console.log("bandwidth: " + xBand.bandwidth() * event.transform.k);
            console.log("event transform: " + event.transform);

            // Get the lowest low and highest high from the new price data
            minP = +d3.min(filtered, d => d.l);
            maxP = +d3.max(filtered, d => d.h);

            // Margin top and bottom
            buffer = Math.floor((maxP - minP) * 0.1);

            // Update y scale domain to include margin
            yScale.domain([minP - buffer, maxP + buffer]);

            // Update candlestick bodies
            candles.attr("x", (d, i) => Math.round(newX(i) - (xBand.bandwidth() * event.transform.k) / 2))
                .attr("y", (d) => Math.round(yScale(Math.max(d.o, d.c))))
                .attr("width", Math.floor(xBand.bandwidth() * event.transform.k / 2) * 2 + 1)
                .attr('height', d => (d.o === d.c || Math.round(yScale(Math.min(d.o, d.c))) - Math.round(yScale(Math.max(d.o, d.c))) === 0) ? 1 : Math.round(yScale(Math.min(d.o, d.c))) - Math.round(yScale(Math.max(d.o, d.c))));

            // Update candlestick wicks
            wicks.attr("x1", (d, i) => Math.round(newX(i)) - 0.5) // Fix this - off by 1 pixel to the right on odd zoom
                .attr("x2", (d, i) => Math.round(newX(i)) - 0.5) // Fix this
                .attr("y1", (d) => Math.round(yScale(d.h)))
                .attr("y2", (d) => Math.round(yScale(d.l)));

            // Update the y-axis
            gY.call(d3.axisRight().scale(yScale).tickSize(0));
        }

    });
}

function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#0084ff', controlSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromSlider.value = from;
    }
}

function controlToInput(toSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#0084ff', controlSlider);
    setToggleAccessible(toInput);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
    }
}

function controlFromSlider(fromSlider, toSlider, fromInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#0084ff', toSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromInput.value = from;
    }
}

function controlToSlider(fromSlider, toSlider, toInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#0084ff', toSlider);
    setToggleAccessible(toSlider);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
        toSlider.value = from;
    }
}

function getParsed(currentFrom, currentTo) {
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max - to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition) / (rangeDistance) * 100}%,
      ${rangeColor} ${((fromPosition) / (rangeDistance)) * 100}%,
      ${rangeColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
    const toSlider = document.querySelector('#toSlider');
    if (Number(currentTarget.value) <= 0) {
        toSlider.style.zIndex = 2;
    } else {
        toSlider.style.zIndex = 0;
    }
}

const fromSlider = document.querySelector('#fromSlider');
const toSlider = document.querySelector('#toSlider');
const fromInput = document.querySelector('#fromInput');
const toInput = document.querySelector('#toInput');
fillSlider(fromSlider, toSlider, '#C6C6C6', '#0084ff', toSlider);
setToggleAccessible(toSlider);

fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);


function showTime() {
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    var time = h + ":" + m + ":" + s;
    document.getElementById("clock").innerText = time;
    document.getElementById("clock").textContent = time;

    setTimeout(showTime, 1000);
}

drawChart(poliQuery);