import React from "react";
import {
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
} from "@material-ui/core";
import { Link, AddBoxOutlined } from "@material-ui/icons";
import ReactPlayer from "react-player";
import SoundcloudPlayer from "react-player/lib/players/SoundCloud";
import YouTubePlayer from "react-player/lib/players/YouTube";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
  },
  urlInput: {
    margin: theme.spacing(1),
  },
  addSongButton: {
    margin: theme.spacing(1),
  },
  dialog: {
    textAlign: "center",
  },
  thumbnail: {
    width: "90%",
  },
}));

function AddSong() {
  const classes = useStyles();
  const [url, setUrl] = React.useState("");
  const [dialog, setDialog] = React.useState(false);
  const [playable, setPlayable] = React.useState(false);
  const [song, setSong] = React.useState({
    duration: 0,
    title: "",
    artist: "",
    thumbnail: "",
  });

  React.useEffect(() => {
    const isPlayable =
      SoundcloudPlayer.canPlay(url) || YouTubePlayer.canPlay(url);
    setPlayable(isPlayable);
  }, [url]);

  function handleChangeSong(e) {
    const { name, value } = e.target;
    setSong((prevSong) => ({
      ...prevSong,
      [name]: value,
    }));
  }

  function handleCloseDialog() {
    setDialog(false);
  }

  async function handelEditSong({ player }) {
    const nestedPlayer = player.player.player;
    let songData;
    if (nestedPlayer.getVideoData) {
      songData = getYoutubeInfo(nestedPlayer);
    } else if (nestedPlayer.getCurrentSound) {
      songData = await getSoundcloudInfo(nestedPlayer);
    }
    setSong({ ...songData, url });
  }

  function getYoutubeInfo(player) {
    const duration = player.getDuration();
    const { title, video_id, author } = player.getVideoData();
    const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
    return {
      duration,
      title,
      artist: author,
      thumbnail,
    };
  }

  function getSoundcloudInfo(player) {
    return new Promise((resolve) => {
      player.getCurrentSound((songData) => {
        if (songData) {
          resolve({
            duration: Number(songData.duration / 1000),
            title: songData.title,
            artist: songData.user.username,
            thumbnail: songData.artwork_url.replace("-large", "-t500x500"),
          });
        }
      });
    });
  }

  const { title, artist, thumbnail } = song;

  return (
    <div className={classes.container}>
      <Dialog
        className={classes.dialog}
        open={dialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Edit Song</DialogTitle>
        <DialogContent>
          <img
            src={thumbnail}
            alt="Song thumbnail"
            className={classes.thumbnail}
          />
          <TextField
            value={title}
            onChange={handleChangeSong}
            margin="dense"
            name="title"
            label="Title"
            fullWidth
          />
          <TextField
            value={artist}
            onChange={handleChangeSong}
            margin="dense"
            name="artist"
            label="Artist"
            fullWidth
          />
          <TextField
            value={thumbnail}
            onChange={handleChangeSong}
            margin="dense"
            name="thumbnail"
            label="Thumbnail"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button variant="outlined" color="primary">
            Add Song
          </Button>
        </DialogActions>
      </Dialog>
      <TextField
        className={classes.urlInput}
        onChange={(e) => setUrl(e.target.value)}
        value={url}
        placeholder="Add Youtube or Soundcloud Url"
        fullWidth
        margin="normal"
        type="url"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Link />
            </InputAdornment>
          ),
        }}
      />
      <Button
        disabled={!playable}
        className={classes.addSongButton}
        onClick={() => setDialog(true)}
        variant="contained"
        color="primary"
        endIcon={<AddBoxOutlined />}
      >
        Add
      </Button>
      <ReactPlayer url={url} hidden onReady={handelEditSong} />
    </div>
  );
}

export default AddSong;
