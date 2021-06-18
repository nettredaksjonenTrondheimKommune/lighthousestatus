import './App.css';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid,
    Card,
    CardHeader,
    CardContent,
    Typography,
    CircularProgress
} from '@material-ui/core/';

const useStyles = makeStyles({
  root: {
    minWidth: 250
  },
  title: {
    fontSize: 14
  },
  pos: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  barColorGreen: {
    color: "green",
  },
  barColorOrange: {
    color: "orange"
  },
  barColorRed: {
    color: "red"
  }
});

export default function App() {
  const classes = useStyles();
  const json = require('./data.json');
  const requestedUrl = "Status for: " + json.requestedUrl.slice(0, -1);
  const data = [json.categories["accessibility"], json.categories["best-practices"], json.categories["performance"], json.categories["seo"]];

  let cards = data.map(res => ({
    id: res.id,
    title: res.title,
    score: res.score * 100,
    barColor: ''
  }));

  for (var i = 0; i < cards.length; i++) {
    if (cards[i].score > 75) {
      cards[i].barColor = classes.barColorGreen;
    } else if (cards[i].score < 75 && cards[i].score > 25) {
      cards[i].barColor = classes.barColorOrange;
    } else {
      cards[i].barColor = classes.barColorRed;
    }
  }

  const cardContent =
    (<Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center">
            <Grid item>
              <Card>
                <CardHeader title={requestedUrl} />
                {cards.map((card) => (
                  <CardContent key={card.id}>
                    <Typography variant="h5" component="h2">
                      {card.title}
                    </Typography>
                    <Typography variant="body1" component="h3" color="textSecondary">
                      <CircularProgress className={card.barColor} variant="determinate" value={card.score} />
                    </Typography>
                    <Typography variant="body2" component="p">
                      Score: {card.score}
                    </Typography>
                  </CardContent>
                ))}
              </Card>
            </Grid>
        </Grid>
      </Grid>
    </Grid>
    );

  return (
    <div>
      {cardContent}
    </div>
  );
}
