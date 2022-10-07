const Joi = require('joi')
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id:1, name: 'course1'},
    {id:2, name: 'course2'},
    {id:3, name: 'course3'}
]

app.get('/api/courses', (req,res) => {
    res.send(courses);
})

app.get('/api/courses/:id', (req,res) =>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        res.status(404).send('The id was not found');
    } else {
        res.send(course)
    }
})


app.post('/api/courses', (req,res) => {
    const schema = {
        name: Joi.string().min(3).required()
    }

    const result = new Joi.ValidationError(req.body, schema);
    //sconsole.log(result);
    console.log(result.details);

    if(!req.body.name || req.body.name.length <  3){
        res.status(404).send('Name is required minimum 3 characteers.');
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);

;})
















app.listen(3000, () =>{
    console.log('listening on port 3000...');
})