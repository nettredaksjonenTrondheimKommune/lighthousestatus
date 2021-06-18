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

export default function App() {
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const classes = useStyles();
  const jsondataTrondheimKommune = require('./trondheimKommuneRapport.json');
  const jsondataTrondheim = require('./trondheimRapport.json');
  const requestedUrlTrondheimKommune = jsondataTrondheimKommune.requestedUrl.slice(0, -1);
  const tooltipTrondheimKommune = "Gå til " + requestedUrlTrondheimKommune;
  const requestedUrlTrondheim = jsondataTrondheim.requestedUrl.slice(0, -1);
  const tooltipTrondheim = "Gå til " + requestedUrlTrondheim;
  let rapporter = [
    {'requestedUrl': requestedUrlTrondheimKommune, 'tooltip': tooltipTrondheimKommune},
    {'requestedUrl': requestedUrlTrondheim, 'tooltip': tooltipTrondheim}
  ];
  
  var rapportDatoData = jsondataTrondheimKommune.fetchTime;
  var rapportDato = rapportDatoData.split("T");
  var rapportTidspunkt = rapportDato[1].split(":");
  rapportTidspunkt = rapportTidspunkt[0] + ":" + rapportTidspunkt[1];
  rapportDato = rapportDato[0].split("-");
  rapportDato = rapportDato[2] + "." + rapportDato[1] + "." + rapportDato[0]
  const rapportTid = "Sist oppdatert: " + rapportDato + " " + rapportTidspunkt;
  const data = [
                jsondataTrondheimKommune.categories["accessibility"],
                jsondataTrondheimKommune.categories["best-practices"],
                jsondataTrondheimKommune.categories["performance"],
                jsondataTrondheimKommune.categories["seo"]
              ];

  let cards = data.map(res => ({
    id: res.id,
    title: res.title,
    score: res.score * 100,
    barColor: ''
  }));

  for (var i = 0; i < cards.length; i++) {
    if (cards[i].score > 80) {
      cards[i].barColor = classes.barColorGreen;
    } else if (cards[i].score < 80 && cards[i].score > 30) {
      cards[i].barColor = classes.barColorOrange;
    } else {
      cards[i].barColor = classes.barColorRed;
    }
  }

  const accordion = (
    rapporter.map((rapport) => (
      <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
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
                {cards.map((card) => (
                  <Grid key={card.id} item xs={3}>
                    <Typography variant="h6" component="h2">
                      {card.title}
                    </Typography>
                    <Typography variant="body1" component="h3">
                      <CircularProgress className={card.barColor} variant="determinate" value={card.score} />
                    </Typography>
                    <Typography variant="body2">
                      Score: {card.score}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
        <Typography variant="subtitle1" align="center">
          {rapportTid}
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
