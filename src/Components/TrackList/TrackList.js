import './TrackList.css';
import React from 'react';
import Track from '../Track/Track';

class TrackList extends React.Component {
  render() {
    return (
      <div className="TrackList">
        {
          this.props.tracks.map(track => {
            return <Track onAdd={this.props.onAdd} key={track.id} track={track} isRemoval={this.props.isRemoval}  onRemove={this.props.onRemove}/>;
          })
        }
      </div>
    );  
  }
}

export default TrackList;