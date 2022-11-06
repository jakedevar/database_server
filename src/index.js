require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fs = require('fs')
const app = express()
const PORT = process.env.PORT
const url = process.env.MONGODB
// const router = require('./routes/getData')
// app.use('/api/jobData', router)

const JobDataSchema = new mongoose.Schema({
		languages: Object, 
		frameworks: Object, 
		backend: Object, 
		frontend: Object,
		sqlNoSql: Object,
		security: Object,
		testing: Object,
		cloudTerms: Object,
		softwareDevProcesses: Object,
		versionControl: Object,
		operatingSys: Object,
		other: Object,
		salaryInfo: Object,
		termCounts: Object,
		jobCollection: Object,
		date: String
})

const JobData = mongoose.model('JobData', JobDataSchema)

app.use(express.static('./views/build'))
app.use(cors())

app.get('/api/jobData', async (req, res) => {
	await mongoose.connect(url)
	const date = new Date()
	let month = date.getMonth() + 1
	let day = date.getDate()
	let year = date.getFullYear()
	const string = `glassdoor_${month}_${day}_${year}`
	console.log(string)
	let data = await JobData.find({date: string})
	if (data.length === 0) {
		while (data.length === 0) {
			day--
			if (day <= 0) {
				month--
				day = 31
			}
			const string = `glassdoor_${month}_${day}_${year}`
			data = await JobData.find({date: string})
		}
	}
	mongoose.connection.close()
	console.log(data)
	res.send(data)
})

// use json for req body
app.use(express.json())

app.post('/api/jobData', async (req, res) => {
	try {
		await mongoose.connect(url)
		const JobDataObj = new JobData(req.body)
		await JobDataObj.save()
		await mongoose.connection.close()
		res.send('yes')
	} catch (e) {
		console.log(e)
	}
})

app.get('/api/pastData', async (req, res) => {
	try {
		const data = fs.readFileSync('./glassdoor_9_16_2022.json')
		const parsedData = JSON.parse(data)
		await mongoose.connect(url)
		const JobDataObj = new JobData(parsedData)
		await JobDataObj.save()
		await mongoose.connection.close()
		res.send('yes')
	} catch (error) {
		console.log(error)
	}
})

app.delete('/api/jobData', async (req, res) => {
	await mongoose.connect(url)
	await JobData.find().remove().exec()
	await mongoose.connection.close()
	res.send('yes')
})

app.listen(process.env.PORT || PORT, () => {
	console.log(`Listining on port ${PORT}`)
})
