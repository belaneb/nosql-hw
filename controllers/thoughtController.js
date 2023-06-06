const Thought = require('../models/Thought');
const User = require('../models/User');

const express = require('express');

const router = express.Router();

// GET all thoughts
const getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch thoughts' });
  }
};

// GET a single thought by ID
const getThoughtById = async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const thought = await Thought.findById(thoughtId).populate('reactions');
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch thought' });
  }
};

// POST create a new thought
const createThought = async (req, res) => {
  const { thoughtText, username, userId } = req.body;
  try {
    const thought = await Thought.create({ thoughtText, username });
    await User.findByIdAndUpdate(userId, { $push: { thoughts: thought._id } });
    res.status(201).json(thought);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Failed to create thought' });
  }
};

// PUT update a thought by ID
const updateThought = async (req, res) => {
  const { thoughtId } = req.params;
  const { thoughtText } = req.body;
  try {
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { thoughtText },
      { new: true }
    );
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update thought' });
  }
};

// DELETE remove a thought by ID
const deleteThought = async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const thought = await Thought.findByIdAndDelete(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    await User.findByIdAndUpdate(thought.username, { $pull: { thoughts: thoughtId } });
    res.json({ message: 'Thought deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete thought' });
  }
};

// POST create a reaction for a thought
const createReaction = async (req, res) => {
  const { thoughtId } = req.params;
  const { reactionBody, username } = req.body;
  try {
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $push: { reactions: { reactionBody, username } } },
      { new: true }
    );
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.status(201).json(thought);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create reaction' });
  }
};

// DELETE remove a reaction from a thought
const deleteReaction = async (req, res) => {
  const { thoughtId } = req.params;
  const { reactionId } = req.body;
  try {
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $pull: { reactions: { _id: reactionId } } },
      { new: true }
    );
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete reaction' });
  }
};


// GET all thoughts
router.get('/', getAllThoughts);

// GET a single thought by ID
router.get('/:thoughtId', getThoughtById);

// POST create a new thought
router.post('/', createThought);

// PUT update a thought by ID
router.put('/:thoughtId', updateThought);

// DELETE remove a thought by ID
router.delete('/:thoughtId', deleteThought);

// POST create a reaction for a thought
router.post('/:thoughtId/reactions', createReaction);

// DELETE remove a reaction from a thought
router.delete('/:thoughtId/reactions', deleteReaction);


module.exports = router;
