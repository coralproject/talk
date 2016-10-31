import aglio from 'aglio';
import fs from 'fs';
import path from 'path';

module.exports.get = (req, res) => {
	fs.readFile(path.resolve('server','docs.apib'), 'utf8', (err, blueprint) => {
		var options = {
			themeVariables: 'default'
		};

		aglio.render(blueprint, options, function (err, html, warnings) {
			//if (err) return console.log(err);
			//if (warnings) console.log(warnings);

			res.send(html);
		});
	});
};
