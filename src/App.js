import './App.css';
import React from 'react';
import {
  makeStyles,
  withStyles
} from '@material-ui/core/styles';
import {
  Tooltip,
  Typography,
  CircularProgress,
  Grid
} from '@material-ui/core/';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LinkIcon from '@material-ui/icons/Link';

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
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: '30px'
    }
  },
  expanded: {}
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
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
  const requestedUrl = filData.requestedUrl.slice(0, -1);
  const tooltip = "Gå til " + requestedUrl;
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

  let endData = [{'requestedUrl': requestedUrl, 'tooltip': tooltip, 'rapportTid': rapportTid}, score];

  return endData;
}

export default function App() {
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

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
      <Accordion key={index} square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1d-content"
          id="panel1d-header">
          <Typography variant="h5" component="h2" className={classes.heading}>Status for: {rapport.requestedUrl}</Typography>
          <Typography className={classes.secondaryHeading}><a href={rapport.requestedUrl}><Tooltip title={rapport.tooltip}><LinkIcon /></Tooltip></a></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container className={classes.root} spacing={3}>
            <Grid item xs={12}>
              <Grid container justify="center">
                {dataScore.map((data, index) => (
                  rapport.requestedUrl === data.id ?
                  (<Grid key={index} item xs={3}>
                    <Typography variant="h6" component="h2">
                      {data.title}
                    </Typography>
                    <Typography variant="body1" component="h3">
                      <CircularProgress className={data.barColor} variant="determinate" value={data.score} />
                    </Typography>
                    <Typography variant="body2">
                      Score: {data.score}
                    </Typography>
                  </Grid>) : null
                ))}
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
        <Typography variant="subtitle1" align="center">
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
