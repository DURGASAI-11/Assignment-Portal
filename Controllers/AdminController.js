const Assignment = require('../Models/Assignment')

exports.viewAssignments = async (req, res) => {
  try {
    //extracting user id
    const id = req.user._id
    //finding all the assignments  tagged to that admin
    const assignments = await Assignment.find({ admin: id })
    res.json({ assignments: assignments })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.acceptAssignment = async (req, res) => {
  try {
    const { id } = req.params
    const work = await Assignment.findOne({ _id: id })

    //checking is the assigned admin or not
    //if yes giving access
    //else forbidden
    if (work.admin.equals(req.user._id)) {
      await Assignment.findByIdAndUpdate(
        { _id: id },
        { status: 'accepted' },
        { runValidators: true, new: true },
      )
      res.send({ message: 'Assignment accepted' })
    } else {
      res
        .status(403)
        .json({ message: 'You dont have permissions to reject this task' })
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.rejectAssignment = async (req, res) => {
  try {
    const { id } = req.params
    const work = await Assignment.findOne({ _id: id })

    //checking is the assigned admin or not
    //if yes giving access
    //else forbidden
    if (work.admin.equals(req.user._id)) {
      await Assignment.findByIdAndUpdate(
        { _id: id },
        { status: 'rejected' },
        { runValidators: true, new: true },
      )
      res.send({ message: 'Assignment rejected' })
    } else {
      res
        .status(403)
        .json({ error: 'You dont have permissions to reject this task' })
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
