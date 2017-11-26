import React from "react";
import { withStyles } from "material-ui/styles";
import Card, { CardActions, CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import Grid from "material-ui/Grid";
import AddIcon from "material-ui-icons/Add";
import ClearIcon from "material-ui-icons/Clear";

const styles = theme => ({
  card: {
    minWidth: 275,
    overflow: "hidden",
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
  buttonContainer: {
    display: "flex",
    contentAlign: "center",
    alignItems: "center",
  }
});

function WordDefinition(props) {
  const { classes, word, pronunciation, definition, isSaved = false } = props;

  return (
    <div>
      <Card className={classes.card}>
        <Grid container>
          <Grid item xs={9}>
            <CardContent>
              <Typography type="headline" component="h2">
                {word}
              </Typography>
              <Typography type="body1" className={classes.pos}>
                {pronunciation}
              </Typography>
              <Typography component="p">
                {definition}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={3} className={classes.buttonContainer}>
            <CardActions>
              <Button fab color={isSaved ? "accent" : "primary"} onClick={() => props.onClick({ word, pronunciation, definition })}>
                {isSaved ? <ClearIcon /> : <AddIcon />}
              </Button>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}

export default withStyles(styles)(WordDefinition);
