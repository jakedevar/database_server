const { Router } = require("express")

const router = Router()


router.get('/api/jobData', async (req, res) => {
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

export default router
