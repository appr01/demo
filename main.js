var width = 830; // The width of the svg is a global variable
var height = 850; // The height of the svg is a global variable

var fdata; // The formatted data is a global variable
var rendered_year = 0;
var playing = false;
var asiaData;
var europeData;
var americasData;
var africaData;
var a ;


// Setting the Y axis
var yAxis = d3.scaleLinear()
	.domain([0, 90])
	.range([height-30, 30])

// Setting the X axis
var xAxis = d3.scaleLog()
	.base(10)
	.range([25, width-10])
	.domain([142, 150000])

var area = d3.scaleLinear()
	.range([55 , 1500])
	.domain([2000, 1400000000]);

// TODO Ordinal scale for colors for example: d3.scaleOrdinal(d3.schemePastel1)
var continentColor = d3.scaleOrdinal(d3.schemePastel1);
//console.log(continentColor);


var svg = d3.select("#svg_chart")//.append("svg")
	.attr("width", width)
	.attr("height", height)
	.style("background", "grey")
	.style("stroke", "black");



 
//svg.append("circle").attr("cx",xAxis(142)).attr("cy","0").attr("r","25").attr("fill","green");	
//console.log(xAxis(152));
//var xAxisGrid = d3.axisBottom(x_axis).ticks(3).tickSize(-800).tickFormat('');
//var yAxisGrid = d3.axisLeft(y_axis).ticks(10).tickSize(-795).tickFormat('');

//svg.append("g").attr("transform","translate(0,800)").call(xAxisGrid).attr("fill","black");
//svg.append("g").attr("transform","translate(25,5)").call(yAxisGrid).attr("fill","black");

var x_axis = d3.axisBottom()
                   .scale(xAxis);

   svg.append("g").attr("transform","translate(0,820)")
       .call(x_axis.ticks(3,"$~s"));


var TEXT = svg.append("text").attr("x","100").attr("y","100").text(rendered_year+1800).attr("fill","black").attr("font-size","100").attr("opacity",".3");
var x_axis_text =svg.append("text").attr("x","680").attr("y","810").text("Income in U.S Dollars").attr("fill","black");
var y_axis_text =svg.append("text").attr("x","7").attr("y","20").text("Life Expectency").attr("fill","black");

var y_axis = d3.axisLeft().scale(yAxis);
	svg.append("g").attr("transform","translate(25,5)").call(y_axis);

// Reading the input data
d3.json("data.json").then(function (data) {

	// Console log the original data
	//console.log(data);

	// Cleanup data
	fdata = data.map(function (year_data) {
		// retain the countries for which both the income and life_exp is specified
		//console.log(year_data);
		return year_data["countries"].filter(function (country) {
			//console.log(country)
			var existing_data = (country.income && country.life_exp);
			return existing_data
		}).map(function (country) {
			// convert income and life_exp into integers (everything read from a file defaults to an string)
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country ;
		})
	});
	console.log(fdata)
	asiaData = data.map(function (year_data){
			
		return year_data["countries"].filter(function(country){
			var existing_data = (country.continent == "asia" && country.income && country.life_exp);
			return existing_data ;
		}).map(function (country) {
			// convert income and life_exp into integers (everything read from a file defaults to an string)
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country ;
		})
	
	})
	
	americasData = data.map(function (year_data){	
		return year_data["countries"].filter(function(country){
			var existing_data = (country.continent == "americas" && country.income && country.life_exp);
			return existing_data ;
		}).map(function (country) {
			// convert income and life_exp into integers (everything read from a file defaults to an string)
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country ;
		})
	
	})
	
	europeData = data.map(function (year_data){	
		return year_data["countries"].filter(function(country){
			var existing_data = (country.continent == "europe" && country.income && country.life_exp);
			return existing_data ;
		}).map(function (country) {
			// convert income and life_exp into integers (everything read from a file defaults to an string)
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country ;
		})
	
	})
	
	africaData = data.map(function (y_data){	
		return y_data["countries"].filter(function(country){
			var exist_data = (country.continent == "africa" && country.income && country.life_exp);
			return exist_data ;
		}).map(function (country) {
			// convert income and life_exp into integers (everything read from a file defaults to an string)
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country ;
		}) 
	
	})

	// Console log the formatted data
	//console.log(fdata);

	// invoke the circle that draws the scatterplot
	// the argument corresponds to the year
	draw_circles(0);
})

	

function gooo(){
	a = document.getElementById("country").value;

	draw_circles(rendered_year);
	//console.log(africaData);
	//console.log(a);
}
	  
// setting the callback function when the slider changes
d3.select("#slider").on("input", render);

// callback function to render the scene when the slider changes
function render() {

	// extracting the value of slider
	var slider_val = d3.select("#slider").property("value");
	
	// rendered_year is the global variable that stores the current year
	// get the rendered_year from the slider (+ converts into integer type)
	rendered_year = +slider_val

	// Call rendering function
	draw_circles(rendered_year)
}

function draw_circles(year) {
	//console.log(year);
	
	var circle_update ; 
	circle_update = svg.selectAll("circle")
		.data(fdata[year]);

	if(a=="all"){

		circle_update = svg.selectAll("circle")
		.data(fdata[year]);

	}
	
	if(a=="asia"){

		circle_update = svg.selectAll("circle")
		.data(asiaData[year]);

	}
	
	if(a=="europe"){

		circle_update = svg.selectAll("circle")
		.data(europeData[year]);

	}
	
	if(a=="americas"){

		circle_update = svg.selectAll("circle")
		.data(americasData[year]);

	}
	
	if(a=="africa"){

		circle_update = svg.selectAll("circle")
		.data(africaData[year]);

	}
	


	TEXT.text(rendered_year+1800);

	// TODO all your rendering D3 code here
	circle_update.enter().append("circle").merge(circle_update)
	.attr("r", d => Math.sqrt(area(d.population)))
	.attr("cx",d => xAxis(d.income))
        .attr("cy",d => yAxis(d.life_exp))
		.attr("fill", d => continentColor(d.continent))
		.attr("opacity",0.7);
	circle_update.exit().remove();	
    	
    // this variable gets set only through the button 
	// therefore step is called in a loop only when play is pressed
	// step is not called when slider is changed
	if (playing)
        setTimeout(step, 50)
}

// callback function when the button is pressed
function play() {
	
	 
	if (d3.select("button").property("value") == "Play") {
		d3.select("button").text("Pause")
        d3.select("button").property("value", "Pause")
        playing = true
        step()
	}
	else {
		d3.select("button").text("Play")
        d3.select("button").property("value", "Play")
        playing = false
	}
}

// callback function when the button is pressed (to play the scene)
function step() {
	
	// At the end of our data, loop back
	rendered_year = (rendered_year < 214) ? rendered_year + 1 : 0
	draw_circles(rendered_year)
//console.log(rendered_year)
}


