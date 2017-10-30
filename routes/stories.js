const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');  // for private folders
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

// Stories Index
router.get('/', (req, res) => {
  Story.find({status: 'public'})
  		.populate('user')
  		.then(stories => {
  			 res.render('stories/index', {
  			 	stories
  			 });
  		});
  
});

// Show Single Story
router.get('/show/:id', (req, res) => {
	Story.findOne({
		_id: req.params.id
	})
	.populate('user')
	.populate('comments.commentUser')
	.then(story => {
		res.render('stories/show', {
			story
		});
	});
});

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

// Add Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Story.findOne({
		_id: req.params.id
	})
	.then(story => {
		res.render('stories/edit', {
			story
		});
	});
});

// Process add story
router.post('/', (req, res) => {
	let allowComments;

	if (req.body.allowComments) {
		allowComments = true;
	} else {
		allowComments = false;
	}

	const newStory = {
		title: req.body.title,
		body: req.body.body,
		status: req.body.status,
		allowComments: allowComments,
		user: req.user.id
	}

	// Create story 
	new Story(newStory)
		.save()
		.then( story => {
			res.redirect(`/stories/show/${story.id}`);
		});
});

//Edit Form 
router.put('/:id', (req, res) => {
	Story.findOne({
		_id: req.params.id
	})
	.then(story => {
		let allowComments;

		if (req.body.allowComments) {
			allowComments = true;
		} else {
			allowComments = false;
		}

		// New values 
		story.title = req.body.title;
		story.body = req.body.body;
		story.status = req.body.status;
		story.allowComments =allowComments;

		story.save()
			.then(story => {
				res.redirect('/dashboard');
			});
	});
});

// DELETE story
router.delete('/:id', (req, res) => {
	Story.remove({_id: req.params.id})
			.then(() => {
				res.redirect('/dashboard');
			})
});

// Add Comment
router.post('/comment/:id', (req, res) => {
	Story.findOne({
		_id: req.params.id
	})
	.then(story => {
		const newComment = {
			commentBody: req.body.commentBody,
			commentUser: req.user.id
		}

		// Push to comments array
		story.comments.unshift(newComment);

		story.save()
				.then(story => {
					res.redirect(`/stories/show/${story.id}`);
				}) 
	});
});

module.exports = router;