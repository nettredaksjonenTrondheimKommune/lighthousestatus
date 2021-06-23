import './App.css';
import React from 'react';
import {
  makeStyles,
  withStyles
} from '@material-ui/core/styles';
import {
  Typography,
  CircularProgress,
  Grid
} from '@material-ui/core/';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    textAlign: 'center'
  },
  heading: {
    flexBasis: '50%',
    flexShrink: 0
  },
  secondaryHeading: {
    flexBasis: '25%',
    flexShrink: 0,
    color: theme.palette.text.secondary
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
}));

const Accordion = withStyles({
  root: {
    border: '2px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: '30px'
    },
    width: '75%',
    marginLeft: 'auto !important',
    marginRight: 'auto !important'
  },
  expanded: {}
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    color: 'white',
    backgroundColor: '#005aa7',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56
    }
  },
  content: {
    '&$expanded': {
      margin: '12px 0'
    }
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  },
}))(MuiAccordionDetails);

function getData(filData) {
  let requestedUrl = filData.requestedUrl.slice(0, -1);
  let requestedUrlLenketekst = '';
  let urlLedetekst = '';
  if (requestedUrl === 'https://www.trondheim.kommune.no') {
    urlLedetekst = 'trondheim.kommune.no';
    requestedUrlLenketekst = "Gå til " + urlLedetekst;
  } else if (requestedUrl === 'https://www.trondheim.no') {
    urlLedetekst = 'trondheim.no';
    requestedUrlLenketekst = "Gå til " + urlLedetekst;
  }
  const lighthouseUrl = "https://lighthouse-dot-webdotdevsite.appspot.com/lh/html?url=" + requestedUrl;
  const lighthouseUrlLenketekst = "Gå til Lighthouse rapport";
  var rapportDatoData = filData.fetchTime;
  var rapportDato = rapportDatoData.split("T");
  var rapportTidspunkt = rapportDato[1].split(":");
  rapportTidspunkt = rapportTidspunkt[0] + ":" + rapportTidspunkt[1];
  rapportDato = rapportDato[0].split("-");
  rapportDato = rapportDato[2] + "." + rapportDato[1] + "." + rapportDato[0]
  const rapportTid = "Sist oppdatert: " + rapportDato + " " + rapportTidspunkt;
  const data = [
    filData.categories["accessibility"],
    filData.categories["best-practices"],
    filData.categories["performance"],
    filData.categories["seo"]
  ];

  let score = data.map(res => ({
      id: requestedUrl,
      title: res.title,
      score: res.score * 100,
      barColor: ''
  }));

  for (var i = 0; i < score.length; i++) {
    if (score[i].score > 80) {
        score[i].barColor = "makeStyles-barColorGreen-4";
    } else if (score[i].score < 80 && score[i].score > 30) {
        score[i].barColor = "makeStyles-barColorOrange-5";
    } else {
        score[i].barColor = "makeStyles-barColorRed-36";
    }
  }

  let endData = [{'requestedUrl': requestedUrl, 'urlLedetekst': urlLedetekst, 'requestedUrlLenketekst': requestedUrlLenketekst, 'lighthouseUrl': lighthouseUrl, 'lighthouseUrlLenketekst': lighthouseUrlLenketekst, 'rapportTid': rapportTid}, score];

  return endData;
}

export default function App() {
  const classes = useStyles();

  let filTrondheimKommune = require('./trondheimKommuneRapport.json');
  let dataTrondheimKommune = getData(filTrondheimKommune);
  let filTrondheim = require('./trondheimRapport.json');
  let dataTrondheim = getData(filTrondheim);

  let dataScore = dataTrondheimKommune[1].concat(dataTrondheim[1]);

  let rapporter = [
    dataTrondheimKommune[0],
    dataTrondheim[0]
  ];

  const accordion = (
    rapporter.map((rapport, index) => (
      <Accordion key={index} expanded>
        <AccordionSummary
          aria-controls={index}
          aria-label="Utvid"
          id={rapport.requestedUrl}>
          <Grid container className={classes.root} spacing={3}>
            <Grid item xs={12}>
              <Grid container justify="center">
                <Grid item lg={6} xs={12}><Typography variant="h5" component="h1" className={classes.heading}>Status for: {rapport.urlLedetekst}</Typography></Grid>
                <Grid item lg={3} xs={12}><Typography className={classes.secondaryHeading}><a href={rapport.requestedUrl}>{rapport.requestedUrlLenketekst}</a></Typography></Grid>
                <Grid item lg={3} xs={12}><Typography className={classes.secondaryHeading}><a href={rapport.lighthouseUrl}>{rapport.lighthouseUrlLenketekst}</a></Typography></Grid>
              </Grid>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container className={classes.root} spacing={3}>
            <Grid item xs={12}>
              <Grid container justify="center">
                {dataScore.map((data, index) => (
                  rapport.requestedUrl === data.id ?
                  (<Grid key={index} item lg={3} sm={6} xs={12}>
                    <Typography variant="h6" component="h2">
                      {data.title}
                    </Typography>
                    <CircularProgress className={data.barColor} variant="determinate" value={data.score} />
                    <Typography variant="body1">
                      Score: {data.score}
                    </Typography>
                  </Grid>) : null
                ))}
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
        <Typography variant="subtitle1" component="p" align="center">
          {rapport.rapportTid}
        </Typography>
      </Accordion>
    ))
  );

  return (
    <div>
      {accordion}
    </div>
  );
}
