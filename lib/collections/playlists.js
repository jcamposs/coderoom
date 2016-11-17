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

Playlists = new Mongo.Collection ('playlists');

Meteor.methods ({
  createPlayList: function(title) {
    var optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };

    var listId = Playlists.insert({
      'title': title,
      'ownerId': Meteor.userId(),
      'owner': Meteor.user().profile.name,
      'createdAt': new Date().toLocaleDateString('en-US', optionsDate),
      'items': []
    });

    return listId;
  },

  deletePlaylist: function(id) {
    Playlists.remove(id);
  },

  addRecordingToPlayList: function(idList, itemId) {
    Playlists.update({_id: idList}, {$push: {items: itemId}});
  }
});
