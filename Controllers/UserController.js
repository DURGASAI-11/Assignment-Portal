const User = require('../Models/User')
const Assignment = require('../Models/Assignment')

// creating a new task record in user collection
exports.uploadAssignment = async (req, res) => {
  try {
    //extracting task and adminId from req
    const { task, adminId } = req.body
    //creating a new record in assignments collection
    const assignment = await Assignment.create({
      userId: req.user._id,
      task,
      admin: adminId,
    })

    res.status(201).json({ assignment: assignment })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

//fetching all admins from the User collection
exports.fetchAdmins = async (req, res) => {
  try {
    //extracting all the admins from user collection
    const allAdmins = await User.find({ role: 'admin' })
    res.json({ admins: allAdmins })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
