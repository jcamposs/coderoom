/**
 *   Copyright (C) 2016 Jorge Campos Serrano.
 *
 *   This program is free software: you can redistribute it and/or  modify
 *   it under the terms of the GNU Affero General Public License, version 3,
 *   as published by the Free Software Foundation.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *   You should have received a copy of the GNU Affero General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *   As a special exception, the copyright holders give permission to link the
 *   code of portions of this program with the OpenSSL library under certain
 *   conditions as described in each individual source file and distribute
 *   linked combinations including the program with the OpenSSL library. You
 *   must comply with the GNU Affero General Public License in all respects
 *   for all of the code used other than as permitted herein. If you modify
 *   file(s) with this exception, you may extend this exception to your
 *   version of the file(s), but you are not obligated to do so. If you do not
 *   wish to do so, delete this exception statement from your version. If you
 *   delete this exception statement from all source files in the program,
 *   then also delete it in the license file.
 */

Template.inviteGuest.helpers({
  users: function() {
    return Meteor.users.find({_id: {$ne: Meteor.userId()}});
  }
});

Template.inviteGuest.events({
'click .btn-js-send': function(e) {
  e.preventDefault();

  var room = Rooms.findOne({_id: $("#inviteGuest.modal").attr('data-id')});

  $('input:checkbox:checked').each(function(){
    var receiver = $(this).val();
    var sender = Meteor.user().profile.name;

    var ntf = {
      receiver: receiver,
      sender: sender,
      img: Meteor.user().services.google.picture,
      urlToContent: room._id,
      content: sender + ' wants you to join the room ' + room.name
    };

    Meteor.call('createNotification', ntf, function(err) {
      if(err) {
        throwAlert('error', 'Error when share link', 'alert-circle');
      }
    });
  });

  $('.modal').modal('hide');
 }
});
