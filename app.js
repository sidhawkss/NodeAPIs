const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id:1, name: 'course1'},
    {id:2, name: 'course2'},
    {id:3, name: 'course3'}
]

// Function to validate course.
function validateCourse(course){

    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const result = schema.validate(course);

    return result;
}

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
    })

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

app.put('/api/courses/:id', (req,res) =>{
    
    // Update and course
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