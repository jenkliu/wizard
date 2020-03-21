# wizard

GRAB THE MOST RECENT ROOM
db.rooms.find().sort({createdAt: -1})[0]

HOW DO I CALL MONGO FUNCTION FROM THE COMMAND LINE? rather than using the UI
meteor shell
Meteor.call('rooms.create')
