const config = require('config');
const Joi = require('joi');
const express = require('express');
const app = express();
const morgan = require('morgan');
const pug = require('pug');

// Template engine configuration
app.set('view engine', 'pug');
app.set('views','./views')

// Config: Configuration
console.log('Application Name: '+config.get('name'));
console.log('Server: '+config.get('principal.host'));


// Set morgan by environment
console.log(`ENV running: ${process.env.NODE_ENV}`); 

if(app.get('env') == "development"){	
	app.use(morgan('tiny'));
	console.log('Morgan middlware enabled[!]');
}


// Course dict
const courses = [
    {id:1, name: 'course1'},
    {id:2, name: 'course2'},
    {id:3, name: 'course3'}
]


// Function to validate course.
function validateCourse(course){

    const schema = Joi.object({
		name: Joi.string().min(3).required(),
    });

    const result = schema.validate(course);

	return result;
}

function inputValidation(query){

    const schema = Joi.object({
    	message: Joi.string().min(5)
    });

    const result = schema.validate(query);

    return result;

}


// Main route
app.get('/',(req,res) => {

	// Validation
	let { error } = inputValidation(req.query);

	if(!error){
		res.status(404).send("Error occurred!");
	}else{
		res.render('index', {message:req.query.message});
	}

});


// Principal route
app.get('/api/courses', (req,res) => {

    res.send(courses);

})

// Get course by id
app.get('/api/courses/:id', (req,res) =>{

    const course = courses.find(c => c.id === parseInt(req.params.id));
    
    if(!course){
        res.status(404).send('The id was not found');
    } else {
        res.send(course);
    }

})

// Add an item to courses
app.post('/api/courses', (req,res) => {

    // Validation of the user input
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

	const { error } = schema.validate(req.body);

	const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    // Identify the input and send a message to the user.
    if(error){
        res.status(404).send("Error, input a valid string");
    }else{
        courses.push(course);
        res.send(course);
    }

;})


// Route to update courses
app.put('/api/courses/:id', (req,res) =>{
    
    const course  = courses.find(c => c.id === parseInt(req.params.id));

    if(!course){
        res.status(404).send("The course was not found!")
    };

    const {error} = validateCourse(req.body);

    if(error){
        res.status(404).send("Error, input a valid string");
        return;
    };

    course.name = req.body.name;
    res.send(course);
})


// Route to delete course
app.delete('/api/courses/:id', (req,res) =>{
    
    const course  = courses.find(c => c.id === parseInt(req.params.id))
    if(!course){
        res.status(404).send("The course was not found!")
    }else{
        const index = courses.indexOf(course);
        courses.splice(index, 1) // delete
        res.send(course);
    }

})


app.listen(5000, () =>{
    console.log('listening on port 5000...');
})
