import React from "react";
import { withStyles } from "material-ui/styles";
import Card, { CardActions, CardContent } from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";

const styles = theme => ({
  card: {
    minWidth: 275
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary
  }
});

const ReviewCard = ({
  classes,
  word,
  pronunciation,
  definition,
  backShown,
  pass,
  fail,
  showBack
}) => {
  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography type="body1" className={classes.title}>
            {word}
          </Typography>
          {backShown ? (
            <div>
              <Typography type="headline" component="h2">
                {pronunciation}
              </Typography>
              <Typography component="p">{definition}</Typography>
            </div>
          ) : null}
        </CardContent>
        <CardActions>
          {backShown ? (
            <div>
              <Button dense onClick={fail}>
                Fail
              </Button>
              <Button dense onClick={pass}>
                Pass
              </Button>
            </div>
          ) : (
            <div>
              <Button dense onClick={showBack}>
                Show
              </Button>
            </div>
          )}
        </CardActions>
      </Card>
    </div>
  );
};

export default withStyles(styles)(ReviewCard);
