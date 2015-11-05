var Iconv = require('iconv').Iconv;
var iconv = new Iconv('cp1251', 'utf-8');
var request = require('request');
var parseString = require('xml2js').parseString;
var currency = {};

module.exports.updateCurrency = function() {
  request('http://www.cbr.ru/scripts/XML_daily.asp', function(error, response, body) {
    if (!error && response.statusCode === 200) {

      body = iconv.convert(body).toString();

      parseString(body, function(err, result) {

        var valute = result.ValCurs.Valute;

        for (var key in valute) {
          currency[valute[key].CharCode] = {
            value: Number(valute[key].Value[0].replace(',', '.')) / Number(valute[key].Nominal[0]),
            name: valute[key].Name[0]
          };
        }
      });

    } else {
      module.exports.updateCurrency();
    }
  });
};

module.exports.updateCurrency();

module.exports.init = function(freq) {
  freq = freq || 3600; // every hour
  setInterval(module.exports.updateCurrency, freq * 1000);
};

module.exports.currency = currency;
