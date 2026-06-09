import { useState, useEffect } from "react";
import { Link } from "wouter";
import "../styles/prime-time.css";

type Phase = "vote" | "results" | "countdown" | "gate";

interface PollOption  { id: string; name: string; tagline: string; logo: string }
interface PollResult  { id: string; name: string; pct: number; logo: string }
interface Poll {
  question: JSX.Element;
  nextTeaser: JSX.Element;
  options: PollOption[];
  results: PollResult[];
}

const POLLS: Poll[] = [
  {
    question: <>Which NFL quarterback will win <span style={{ color: "var(--gold)" }}>MVP</span> in 2026?</>,
    nextTeaser: <>Which NFL team will win <span style={{ color: "var(--gold)" }}>Super Bowl LX</span>?</>,
    options: [
      { id: "mahomes", name: "Patrick Mahomes", tagline: "Four-Time Champion",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "lamar",   name: "Lamar Jackson",   tagline: "Back-to-Back MVP",    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
      { id: "allen",   name: "Josh Allen",      tagline: "Buffalo's Franchise", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" },
      { id: "burrow",  name: "Joe Burrow",      tagline: "The Bengals' Ace",    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png" },
    ],
    results: [
      { id: "mahomes", name: "Patrick Mahomes", pct: 41, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "lamar",   name: "Lamar Jackson",   pct: 29, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
      { id: "allen",   name: "Josh Allen",      pct: 19, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" },
      { id: "burrow",  name: "Joe Burrow",      pct: 11, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png" },
    ],
  },
  {
    question: <>Which NFL team will win <span style={{ color: "var(--gold)" }}>Super Bowl LX</span>?</>,
    nextTeaser: <>Which running back will lead the NFL in <span style={{ color: "var(--gold)" }}>rushing yards</span> in 2026?</>,
    options: [
      { id: "chiefs",  name: "Kansas City Chiefs",  tagline: "Dynasty Mode",   logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "ravens",  name: "Baltimore Ravens",    tagline: "Lamar's Time",   logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
      { id: "eagles",  name: "Philadelphia Eagles", tagline: "Back-to-Back?",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png" },
      { id: "niners",  name: "San Francisco 49ers", tagline: "Kyle's System",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"  },
    ],
    results: [
      { id: "chiefs",  name: "Kansas City Chiefs",  pct: 38, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "eagles",  name: "Philadelphia Eagles", pct: 27, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png" },
      { id: "ravens",  name: "Baltimore Ravens",    pct: 22, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
      { id: "niners",  name: "San Francisco 49ers", pct: 13, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"  },
    ],
  },
  {
    question: <>Which running back will lead the NFL in <span style={{ color: "var(--gold)" }}>rushing yards</span> in 2026?</>,
    nextTeaser: <>Which wide receiver will lead the NFL in <span style={{ color: "var(--gold)" }}>receiving yards</span>?</>,
    options: [
      { id: "henry",      name: "Derrick Henry",     tagline: "The King",           logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "mccaffrey",  name: "Christian McCaffrey", tagline: "All-Purpose Threat", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"  },
      { id: "barkley",    name: "Saquon Barkley",    tagline: "Eagle Stampede",     logo: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png" },
      { id: "achane",     name: "De'Von Achane",     tagline: "Speed Demon",        logo: "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png" },
    ],
    results: [
      { id: "barkley",   name: "Saquon Barkley",     pct: 35, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png" },
      { id: "henry",     name: "Derrick Henry",      pct: 30, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "mccaffrey", name: "Christian McCaffrey",pct: 22, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"  },
      { id: "achane",    name: "De'Von Achane",      pct: 13, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png" },
    ],
  },
  {
    question: <>Which wide receiver will lead the NFL in <span style={{ color: "var(--gold)" }}>receiving yards</span> in 2026?</>,
    nextTeaser: <>Which NFL team has the best <span style={{ color: "var(--gold)" }}>defense</span> entering 2026?</>,
    options: [
      { id: "hill",      name: "Tyreek Hill",    tagline: "Cheetah Mode",       logo: "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png" },
      { id: "chase",     name: "Ja'Marr Chase",  tagline: "Elite Route Runner",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png" },
      { id: "jefferson", name: "Justin Jefferson",tagline: "Griddy King",        logo: "https://a.espncdn.com/i/teamlogos/nfl/500/min.png" },
      { id: "lamb",      name: "CeeDee Lamb",    tagline: "CeeDee's World",     logo: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png" },
    ],
    results: [
      { id: "jefferson", name: "Justin Jefferson", pct: 33, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/min.png" },
      { id: "chase",     name: "Ja'Marr Chase",   pct: 28, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png" },
      { id: "lamb",      name: "CeeDee Lamb",     pct: 22, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png" },
      { id: "hill",      name: "Tyreek Hill",     pct: 17, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png" },
    ],
  },
  {
    question: <>Which NFL team has the best <span style={{ color: "var(--gold)" }}>defense</span> entering 2026?</>,
    nextTeaser: <>Which NFL coach is on the <span style={{ color: "var(--gold)" }}>hottest seat</span> in 2026?</>,
    options: [
      { id: "ravens",   name: "Baltimore Ravens",    tagline: "No. 1 Ranked Unit",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
      { id: "niners",   name: "San Francisco 49ers", tagline: "Bosa & Co.",         logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"  },
      { id: "cowboys",  name: "Dallas Cowboys",      tagline: "Parsons-Led D",      logo: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png" },
      { id: "bills",    name: "Buffalo Bills",       tagline: "Von's Legacy Lives", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" },
    ],
    results: [
      { id: "ravens",  name: "Baltimore Ravens",    pct: 37, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
      { id: "niners",  name: "San Francisco 49ers", pct: 29, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"  },
      { id: "cowboys", name: "Dallas Cowboys",      pct: 21, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png" },
      { id: "bills",   name: "Buffalo Bills",       pct: 13, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" },
    ],
  },
  {
    question: <>Which NFL coach is on the <span style={{ color: "var(--gold)" }}>hottest seat</span> in 2026?</>,
    nextTeaser: <>Which NFL tight end will have the <span style={{ color: "var(--gold)" }}>best season</span> in 2026?</>,
    options: [
      { id: "harbaugh_j", name: "Jim Harbaugh",    tagline: "Chargers' Savior?",    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/lac.png" },
      { id: "ryan",       name: "Matt Ryan",       tagline: "Indy Experiment",      logo: "https://a.espncdn.com/i/teamlogos/nfl/500/ind.png" },
      { id: "daboll",     name: "Brian Daboll",    tagline: "Giants Under Pressure", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png" },
      { id: "flores",     name: "Mike Flores",     tagline: "Minnesota Rebuild",    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/min.png" },
    ],
    results: [
      { id: "daboll",     name: "Brian Daboll",    pct: 38, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png" },
      { id: "ryan",       name: "Matt Ryan",       pct: 27, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/ind.png" },
      { id: "harbaugh_j", name: "Jim Harbaugh",    pct: 20, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/lac.png" },
      { id: "flores",     name: "Mike Flores",     pct: 15, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/min.png" },
    ],
  },
  {
    question: <>Which NFL tight end will have the <span style={{ color: "var(--gold)" }}>best season</span> in 2026?</>,
    nextTeaser: <>Which team will lead the NFL in <span style={{ color: "var(--gold)" }}>regular season wins</span> in 2026?</>,
    options: [
      { id: "kelce",    name: "Travis Kelce",  tagline: "The GOAT TE",       logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "andrews",  name: "Mark Andrews",  tagline: "Baltimore's Rock",   logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
      { id: "kittle",   name: "George Kittle", tagline: "Most Complete TE",   logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"  },
      { id: "laporta",  name: "Sam LaPorta",   tagline: "Detroit's Breakout", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/det.png" },
    ],
    results: [
      { id: "kelce",   name: "Travis Kelce",  pct: 39, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "kittle",  name: "George Kittle", pct: 28, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"  },
      { id: "andrews", name: "Mark Andrews",  pct: 21, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
      { id: "laporta", name: "Sam LaPorta",   pct: 12, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/det.png" },
    ],
  },
  {
    question: <>Which team will lead the NFL in <span style={{ color: "var(--gold)" }}>regular season wins</span> in 2026?</>,
    nextTeaser: <>Which quarterback will throw the most <span style={{ color: "var(--gold)" }}>touchdown passes</span> in 2026?</>,
    options: [
      { id: "chiefs",  name: "Kansas City Chiefs",  tagline: "Still the Standard",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "eagles",  name: "Philadelphia Eagles", tagline: "Defending Champs",     logo: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png" },
      { id: "ravens",  name: "Baltimore Ravens",    tagline: "Lamar's Crew",         logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
      { id: "bills",   name: "Buffalo Bills",       tagline: "Josh's Window",        logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" },
    ],
    results: [
      { id: "chiefs",  name: "Kansas City Chiefs",  pct: 36, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "eagles",  name: "Philadelphia Eagles", pct: 26, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png" },
      { id: "ravens",  name: "Baltimore Ravens",    pct: 23, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
      { id: "bills",   name: "Buffalo Bills",       pct: 15, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" },
    ],
  },
  {
    question: <>Which quarterback will throw the most <span style={{ color: "var(--gold)" }}>touchdown passes</span> in 2026?</>,
    nextTeaser: <>Which NFL team will be the biggest <span style={{ color: "var(--gold)" }}>surprise</span> of 2026?</>,
    options: [
      { id: "mahomes", name: "Patrick Mahomes", tagline: "Precision on Command",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "allen",   name: "Josh Allen",      tagline: "Arm Talent Unleashed",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" },
      { id: "lamar",   name: "Lamar Jackson",   tagline: "Dual-Threat Terror",    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
      { id: "burrow",  name: "Joe Burrow",      tagline: "Ice in His Veins",      logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png" },
    ],
    results: [
      { id: "allen",   name: "Josh Allen",      pct: 34, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" },
      { id: "mahomes", name: "Patrick Mahomes", pct: 31, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "lamar",   name: "Lamar Jackson",   pct: 22, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
      { id: "burrow",  name: "Joe Burrow",      pct: 13, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png" },
    ],
  },
  {
    question: <>Which NFL team will be the biggest <span style={{ color: "var(--gold)" }}>surprise</span> of 2026?</>,
    nextTeaser: <>Which NFL team will win the <span style={{ color: "var(--gold)" }}>NFC Championship</span>?</>,
    options: [
      { id: "lions",    name: "Detroit Lions",       tagline: "ARSB & Gibbs Era",     logo: "https://a.espncdn.com/i/teamlogos/nfl/500/det.png" },
      { id: "texans",   name: "Houston Texans",      tagline: "Stroud's Ascent",      logo: "https://a.espncdn.com/i/teamlogos/nfl/500/hou.png" },
      { id: "chargers", name: "Los Angeles Chargers",tagline: "Harbaugh Effect",       logo: "https://a.espncdn.com/i/teamlogos/nfl/500/lac.png" },
      { id: "packers",  name: "Green Bay Packers",   tagline: "Love's Coming of Age", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png"  },
    ],
    results: [
      { id: "lions",    name: "Detroit Lions",        pct: 32, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/det.png" },
      { id: "texans",   name: "Houston Texans",       pct: 28, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/hou.png" },
      { id: "chargers", name: "Los Angeles Chargers", pct: 24, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/lac.png" },
      { id: "packers",  name: "Green Bay Packers",    pct: 16, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png"  },
    ],
  },
  {
    question: <>Which NFL team will win the <span style={{ color: "var(--gold)" }}>NFC Championship</span>?</>,
    nextTeaser: <>Which NFL team will win the <span style={{ color: "var(--gold)" }}>AFC Championship</span>?</>,
    options: [
      { id: "eagles",  name: "Philadelphia Eagles", tagline: "Back-to-Back Run",    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png" },
      { id: "niners",  name: "San Francisco 49ers", tagline: "Brock's Revenge",     logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"  },
      { id: "cowboys", name: "Dallas Cowboys",      tagline: "America's Team",      logo: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png" },
      { id: "lions",   name: "Detroit Lions",       tagline: "Motor City Magic",    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/det.png" },
    ],
    results: [
      { id: "eagles",  name: "Philadelphia Eagles", pct: 36, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png" },
      { id: "niners",  name: "San Francisco 49ers", pct: 28, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"  },
      { id: "lions",   name: "Detroit Lions",       pct: 22, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/det.png" },
      { id: "cowboys", name: "Dallas Cowboys",      pct: 14, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png" },
    ],
  },
  {
    question: <>Which NFL team will win the <span style={{ color: "var(--gold)" }}>AFC Championship</span>?</>,
    nextTeaser: <>Which defensive player will win <span style={{ color: "var(--gold)" }}>DPOY</span> in 2026?</>,
    options: [
      { id: "chiefs",   name: "Kansas City Chiefs", tagline: "Perennial Favorites",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "ravens",   name: "Baltimore Ravens",   tagline: "Physical Brand",       logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
      { id: "bills",    name: "Buffalo Bills",      tagline: "Josh's Year",          logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" },
      { id: "bengals",  name: "Cincinnati Bengals", tagline: "Burrow's Bounce Back", logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png" },
    ],
    results: [
      { id: "chiefs",  name: "Kansas City Chiefs", pct: 40, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "ravens",  name: "Baltimore Ravens",   pct: 27, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png" },
      { id: "bills",   name: "Buffalo Bills",      pct: 21, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" },
      { id: "bengals", name: "Cincinnati Bengals", pct: 12, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png" },
    ],
  },
  {
    question: <>Which defensive player will win <span style={{ color: "var(--gold)" }}>DPOY</span> in 2026?</>,
    nextTeaser: <>Which young QB will make the <span style={{ color: "var(--gold)" }}>biggest leap</span> in 2026?</>,
    options: [
      { id: "parsons",  name: "Micah Parsons",  tagline: "Pass Rush Nightmare",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png" },
      { id: "watt",     name: "T.J. Watt",      tagline: "Pittsburgh's Edge",    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png" },
      { id: "garrett",  name: "Myles Garrett",  tagline: "Cleveland's Force",    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cle.png" },
      { id: "crosby",   name: "Maxx Crosby",    tagline: "Vegas' Monster",       logo: "https://a.espncdn.com/i/teamlogos/nfl/500/lv.png"  },
    ],
    results: [
      { id: "parsons",  name: "Micah Parsons",  pct: 38, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png" },
      { id: "watt",     name: "T.J. Watt",      pct: 28, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png" },
      { id: "garrett",  name: "Myles Garrett",  pct: 21, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/cle.png" },
      { id: "crosby",   name: "Maxx Crosby",    pct: 13, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/lv.png"  },
    ],
  },
  {
    question: <>Which young QB will make the <span style={{ color: "var(--gold)" }}>biggest leap</span> in 2026?</>,
    nextTeaser: <>Which NFL team has the best <span style={{ color: "var(--gold)" }}>offensive line</span> in 2026?</>,
    options: [
      { id: "caleb",   name: "Caleb Williams",  tagline: "Chicago's Hope",       logo: "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png" },
      { id: "daniels", name: "Jayden Daniels",  tagline: "Washington's Future",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png" },
      { id: "maye",    name: "Drake Maye",      tagline: "New England Rising",   logo: "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png"  },
      { id: "mccarthy",name: "J.J. McCarthy",   tagline: "Minnesota's QB1",      logo: "https://a.espncdn.com/i/teamlogos/nfl/500/min.png" },
    ],
    results: [
      { id: "daniels",  name: "Jayden Daniels",  pct: 34, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png" },
      { id: "caleb",    name: "Caleb Williams",   pct: 29, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png" },
      { id: "maye",     name: "Drake Maye",       pct: 23, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png"  },
      { id: "mccarthy", name: "J.J. McCarthy",    pct: 14, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/min.png" },
    ],
  },
  {
    question: <>Which NFL team has the best <span style={{ color: "var(--gold)" }}>offensive line</span> in 2026?</>,
    nextTeaser: <>Which NFL stadium has the best <span style={{ color: "var(--gold)" }}>home-field advantage</span>?</>,
    options: [
      { id: "eagles",  name: "Philadelphia Eagles", tagline: "Dominant Trenches",   logo: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png" },
      { id: "chiefs",  name: "Kansas City Chiefs",  tagline: "Mahomes' Wall",       logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "niners",  name: "San Francisco 49ers", tagline: "Shanahan's System",   logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"  },
      { id: "cowboys", name: "Dallas Cowboys",      tagline: "Massive Up Front",    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png" },
    ],
    results: [
      { id: "eagles",  name: "Philadelphia Eagles", pct: 37, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png" },
      { id: "niners",  name: "San Francisco 49ers", pct: 26, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"  },
      { id: "chiefs",  name: "Kansas City Chiefs",  pct: 21, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "cowboys", name: "Dallas Cowboys",      pct: 16, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png" },
    ],
  },
  {
    question: <>Which NFL stadium has the best <span style={{ color: "var(--gold)" }}>home-field advantage</span>?</>,
    nextTeaser: <>Which NFL team will most <span style={{ color: "var(--gold)" }}>improve</span> in 2026?</>,
    options: [
      { id: "kc",      name: "Arrowhead Stadium",   tagline: "Loudest in the NFL",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "gb",      name: "Lambeau Field",        tagline: "Historic & Frozen",   logo: "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png"  },
      { id: "buf",     name: "Highmark Stadium",     tagline: "Mafia Rules",         logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" },
      { id: "sea",     name: "Lumen Field",          tagline: "12s Are Deafening",   logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png" },
    ],
    results: [
      { id: "kc",  name: "Arrowhead Stadium",  pct: 35, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "buf", name: "Highmark Stadium",   pct: 28, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png" },
      { id: "gb",  name: "Lambeau Field",      pct: 24, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png"  },
      { id: "sea", name: "Lumen Field",        pct: 13, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png" },
    ],
  },
  {
    question: <>Which NFL team will most <span style={{ color: "var(--gold)" }}>improve</span> in 2026?</>,
    nextTeaser: <>Which QB has the most to <span style={{ color: "var(--gold)" }}>prove</span> in 2026?</>,
    options: [
      { id: "patriots",   name: "New England Patriots",  tagline: "Post-Belichick Era",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png"  },
      { id: "bears",      name: "Chicago Bears",         tagline: "Caleb Takes Over",    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png" },
      { id: "commanders", name: "Washington Commanders", tagline: "Daniels Ascending",   logo: "https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png" },
      { id: "giants",     name: "New York Giants",       tagline: "Rebuilding Complete?",logo: "https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png" },
    ],
    results: [
      { id: "commanders", name: "Washington Commanders", pct: 33, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png" },
      { id: "bears",      name: "Chicago Bears",         pct: 28, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png" },
      { id: "patriots",   name: "New England Patriots",  pct: 24, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png"  },
      { id: "giants",     name: "New York Giants",       pct: 15, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png" },
    ],
  },
  {
    question: <>Which QB has the most to <span style={{ color: "var(--gold)" }}>prove</span> in 2026?</>,
    nextTeaser: <>Which coach will win <span style={{ color: "var(--gold)" }}>Coach of the Year</span> in 2026?</>,
    options: [
      { id: "dak",  name: "Dak Prescott",      tagline: "Dallas or Bust",       logo: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png" },
      { id: "tua",  name: "Tua Tagovailoa",    tagline: "Miami's Big Bet",      logo: "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png" },
      { id: "love", name: "Jordan Love",       tagline: "Rodgers' Successor",   logo: "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png"  },
      { id: "carr", name: "Derek Carr",        tagline: "New Orleans Rebuild",  logo: "https://a.espncdn.com/i/teamlogos/nfl/500/no.png"  },
    ],
    results: [
      { id: "dak",  name: "Dak Prescott",   pct: 35, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png" },
      { id: "tua",  name: "Tua Tagovailoa", pct: 27, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png" },
      { id: "love", name: "Jordan Love",    pct: 23, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png"  },
      { id: "carr", name: "Derek Carr",     pct: 15, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/no.png"  },
    ],
  },
  {
    question: <>Which coach will win <span style={{ color: "var(--gold)" }}>Coach of the Year</span> in 2026?</>,
    nextTeaser: <>Which NFL quarterback will win <span style={{ color: "var(--gold)" }}>MVP</span> in 2026?</>,
    options: [
      { id: "reid",      name: "Andy Reid",       tagline: "The Gold Standard",    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "shanahan",  name: "Kyle Shanahan",   tagline: "Scheme Master",        logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"  },
      { id: "campbell",  name: "Dan Campbell",    tagline: "Detroit Believer",     logo: "https://a.espncdn.com/i/teamlogos/nfl/500/det.png" },
      { id: "mcdaniel",  name: "Mike McDaniel",   tagline: "Miami's Innovator",    logo: "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png" },
    ],
    results: [
      { id: "campbell",  name: "Dan Campbell",    pct: 34, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/det.png" },
      { id: "reid",      name: "Andy Reid",       pct: 29, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"  },
      { id: "shanahan",  name: "Kyle Shanahan",   pct: 23, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"  },
      { id: "mcdaniel",  name: "Mike McDaniel",   pct: 14, logo: "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png" },
    ],
  },
];

const GATE_POLL_INDEX = 4; // gate fires on the fifth poll

function ResultBar({ name, pct, logo, isUserPick }: { name: string; pct: number; logo: string; isUserPick: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
      <img src={logo} alt={name} style={{ width: "32px", height: "32px", objectFit: "contain", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: isUserPick ? 700 : 400, letterSpacing: "0.04em", color: "var(--ink)" }}>
            {name}{isUserPick && <span style={{ color: "var(--gold)", marginLeft: "8px", fontSize: "0.75rem" }}>← your vote</span>}
          </span>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: isUserPick ? "var(--gold)" : "var(--ink)" }}>{pct}%</span>
        </div>
        <div style={{ height: "8px", background: "rgba(0,0,0,0.08)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: isUserPick ? "var(--gold)" : "var(--ink)", borderRadius: "4px", transition: "width 0.8s ease" }} />
        </div>
      </div>
    </div>
  );
}

export default function Poll2() {
  const [pollIndex,    setPollIndex]    = useState(0);
  const [phase,        setPhase]        = useState<Phase>("vote");
  const [signedUp,     setSignedUp]     = useState(false);
  const [votes,        setVotes]        = useState<Record<number, string>>({});
  const [selected,     setSelected]     = useState<string | null>(null);
  const [countdown,    setCountdown]    = useState(5);
  const [gateForm,     setGateForm]     = useState({ firstName: "", lastName: "", email: "" });
  const [gateAgree,    setGateAgree]    = useState(true);
  const [gateError,    setGateError]    = useState("");
  const [gateSubmitting, setGateSubmitting] = useState(false);

  const poll = POLLS[pollIndex];
  const nextPoll = POLLS[(pollIndex + 1) % POLLS.length];

  /* ── auto-advance results → countdown after 4 s ── */
  useEffect(() => {
    if (phase !== "results") return;
    const id = setTimeout(() => setPhase("countdown"), 4000);
    return () => clearTimeout(id);
  }, [phase, pollIndex]);

  /* ── countdown 5→0 then advance to next poll ── */
  useEffect(() => {
    if (phase !== "countdown") return;
    setCountdown(5);
    const id = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(id);
          setTimeout(() => {
            const next = (pollIndex + 1) % POLLS.length;
            setPollIndex(next);
            setSelected(null);
            setPhase("vote");
          }, 200);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, pollIndex]);

  function handleVote(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setVotes(v => ({ ...v, [pollIndex]: selected }));
    const needsGate = pollIndex === GATE_POLL_INDEX && !signedUp;
    setPhase(needsGate ? "gate" : "results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleGate(e: React.FormEvent) {
    e.preventDefault();
    if (!gateForm.email || !gateForm.email.includes("@")) { setGateError("Please enter a valid email address."); return; }
    if (!gateAgree) { setGateError("Please agree to receive emails to continue."); return; }
    setGateError("");
    setGateSubmitting(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: gateForm.email, firstName: gateForm.firstName, lastName: gateForm.lastName, source: "poll" }),
      });
    } catch { /* fail silently */ }
    setGateSubmitting(false);
    setSignedUp(true);
    setPhase("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const currentVote  = votes[pollIndex] ?? selected;
  const winnerOption = poll.options.find(o => o.id === currentVote);

  return (
    <div style={{ background: "var(--cream)", color: "var(--ink)", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, overflowX: "hidden", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="topbar">2026 College Football Preview — On Newsstands &amp; Amazon Now</div>
      <nav className="pts-nav">
        <Link href="/"><img src="/logo.png" alt="Prime Time Sports" style={{ height: "91px", display: "block" }} /></Link>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link href="/mailing-list" className="nav-cta">Join Mailing List</Link>
          <Link href="/betting-tips" className="nav-cta">Get Free Betting Tips</Link>
        </div>
      </nav>

      <section className="poll-section">
        {/* eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <span style={{ display: "inline-block", width: "32px", height: "3px", background: "var(--gold)" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: "0.2em", fontSize: "0.9rem", color: "var(--gold)" }}>Fan Poll</span>
          <span style={{ display: "inline-block", width: "32px", height: "3px", background: "var(--gold)" }} />
        </div>

        {/* ══ VOTE ══ */}
        {phase === "vote" && (
          <form onSubmit={handleVote} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "760px" }}>
            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.2rem)", letterSpacing: "-0.01em", textAlign: "center", lineHeight: 1.2, maxWidth: "780px", marginBottom: "56px", color: "var(--ink)" }}>
              {poll.question}
            </h1>
            <div className="poll-grid">
              {poll.options.map(opt => {
                const sel = selected === opt.id;
                return (
                  <button key={opt.id} type="button" onClick={() => setSelected(opt.id)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "28px", background: sel ? "var(--ink)" : "white", border: sel ? "2.5px solid var(--gold)" : "2.5px solid transparent", borderRadius: "4px", cursor: "pointer", textAlign: "center", transition: "all 0.18s ease", boxShadow: sel ? "0 4px 24px rgba(200,168,75,0.18)" : "0 2px 12px rgba(0,0,0,0.07)" }}>
                    <img src={opt.logo} alt={opt.name} style={{ width: "52px", height: "52px", objectFit: "contain" }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.4rem", letterSpacing: "0.04em", color: sel ? "var(--gold)" : "var(--ink)", lineHeight: 1.1 }}>{opt.name}</span>
                    <span style={{ fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", color: sel ? "rgba(255,255,255,0.65)" : "var(--mid)" }}>{opt.tagline}</span>
                    {sel && <span style={{ marginTop: "8px", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600 }}>✓ My Pick</span>}
                  </button>
                );
              })}
            </div>
            <button type="submit" disabled={!selected}
              style={{ marginTop: "32px", padding: "18px 60px", background: selected ? "var(--ink)" : "rgba(0,0,0,0.15)", color: selected ? "var(--gold)" : "rgba(0,0,0,0.3)", border: "none", borderRadius: "4px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: selected ? "pointer" : "not-allowed", transition: "all 0.2s ease" }}>
              Submit Vote
            </button>
          </form>
        )}

        {/* ══ RESULTS (ungated) ══ */}
        {phase === "results" && (
          <div style={{ width: "100%", maxWidth: "600px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              {winnerOption && <img src={winnerOption.logo} alt={winnerOption.name} style={{ width: "72px", height: "72px", objectFit: "contain", marginBottom: "14px" }} />}
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.2em", color: "var(--gold)", marginBottom: "8px" }}>Vote Recorded</div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "var(--ink)", margin: 0 }}>
                You voted for <span style={{ color: "var(--gold)" }}>{winnerOption?.name}</span>
              </h2>
            </div>
            <div className="poll-card" style={{ background: "white", borderRadius: "6px", marginBottom: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.15em", color: "var(--ink)", marginBottom: "20px" }}>Current Results</div>
              {poll.results.map(r => <ResultBar key={r.id} name={r.name} pct={r.pct} logo={r.logo} isUserPick={r.id === currentVote} />)}
            </div>
            <div style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "8px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)" }}>Next poll loading…</span>
            </div>
          </div>
        )}

        {/* ══ COUNTDOWN ══ */}
        {phase === "countdown" && (
          <div style={{ width: "100%", maxWidth: "600px", textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "32px" }}>
              Coming Up Next
            </div>
            <div key={countdown} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: "clamp(5rem, 20vw, 9rem)", lineHeight: 1, color: "var(--ink)", marginBottom: "40px", animation: "countPop 0.35s ease-out" }}>
              {countdown}
            </div>
            <div className="poll-card" style={{ background: "white", borderRadius: "6px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", textAlign: "center" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "14px" }}>Next Question</div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.5vw, 2rem)", color: "var(--ink)", lineHeight: 1.25, margin: 0 }}>
                {poll.nextTeaser}
              </h2>
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                {nextPoll.options.map(o => (
                  <img key={o.id} src={o.logo} alt={o.name} style={{ width: "36px", height: "36px", objectFit: "contain", opacity: 0.45 }} />
                ))}
              </div>
            </div>
            <div style={{ marginTop: "32px", height: "4px", background: "rgba(0,0,0,0.08)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", background: "var(--gold)", borderRadius: "2px", width: `${((5 - countdown) / 5) * 100}%`, transition: "width 0.9s linear" }} />
            </div>
          </div>
        )}

        {/* ══ GATE (fires once, on poll index 1) ══ */}
        {phase === "gate" && (
          <div style={{ width: "100%", maxWidth: "600px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              {winnerOption && <img src={winnerOption.logo} alt={winnerOption.name} style={{ width: "72px", height: "72px", objectFit: "contain", marginBottom: "14px" }} />}
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.2em", color: "var(--gold)", marginBottom: "8px" }}>Vote Recorded</div>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "var(--ink)", margin: 0 }}>
                You voted for <span style={{ color: "var(--gold)" }}>{winnerOption?.name}</span>
              </h2>
            </div>

            {/* Teaser — logos visible, pcts blurred */}
            <div className="poll-card" style={{ background: "white", borderRadius: "6px", marginBottom: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.15em", color: "var(--ink)", marginBottom: "20px" }}>Current Results</div>
              {poll.results.map(r => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                  <img src={r.logo} alt={r.name} style={{ width: "32px", height: "32px", objectFit: "contain", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontSize: "0.82rem", color: "var(--ink)", letterSpacing: "0.04em" }}>{r.name}</span>
                      <span style={{ fontSize: "0.82rem", color: "rgba(0,0,0,0.25)", filter: "blur(5px)", userSelect: "none" }}>00%</span>
                    </div>
                    <div style={{ height: "8px", background: "rgba(0,0,0,0.08)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${r.pct}%`, background: "rgba(0,0,0,0.12)", borderRadius: "4px" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sign-up form */}
            <form onSubmit={handleGate} className="poll-card" style={{ background: "white", borderRadius: "6px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.12em", color: "var(--ink)", marginBottom: "20px" }}>Sign up to keep taking polls</div>
              <div className="poll-name-row">
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mid)", marginBottom: "6px" }}>First Name</label>
                  <input type="text" placeholder="Jordan" value={gateForm.firstName} onChange={e => setGateForm({ ...gateForm, firstName: e.target.value })}
                    style={{ width: "100%", padding: "12px 14px", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif", border: "2px solid rgba(0,0,0,0.12)", borderRadius: "4px", color: "var(--ink)", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mid)", marginBottom: "6px" }}>Last Name</label>
                  <input type="text" placeholder="Mitchell" value={gateForm.lastName} onChange={e => setGateForm({ ...gateForm, lastName: e.target.value })}
                    style={{ width: "100%", padding: "12px 14px", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif", border: "2px solid rgba(0,0,0,0.12)", borderRadius: "4px", color: "var(--ink)", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mid)", marginBottom: "6px" }}>Email Address *</label>
                <input type="email" placeholder="you@example.com" value={gateForm.email} onChange={e => setGateForm({ ...gateForm, email: e.target.value })}
                  style={{ width: "100%", padding: "12px 14px", fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif", border: "2px solid rgba(0,0,0,0.12)", borderRadius: "4px", color: "var(--ink)", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "20px" }}>
                <input type="checkbox" id="gate2-agree" checked={gateAgree} onChange={e => setGateAgree(e.target.checked)}
                  style={{ marginTop: "2px", accentColor: "var(--gold)", width: "16px", height: "16px", flexShrink: 0, cursor: "pointer" }} />
                <label htmlFor="gate2-agree" style={{ fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--mid)", cursor: "pointer", lineHeight: 1.5 }}>
                  I agree to receive emails from Prime Time Sports
                </label>
              </div>
              {gateError && <p style={{ fontSize: "0.82rem", color: "#B94B2A", marginBottom: "14px" }}>{gateError}</p>}
              <button type="submit" disabled={gateSubmitting}
                style={{ width: "100%", padding: "16px", background: "var(--ink)", color: "var(--gold)", border: "none", borderRadius: "4px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
                {gateSubmitting ? "Submitting…" : "Submit"}
              </button>
            </form>
          </div>
        )}
      </section>

      <footer style={{ background: "var(--ink)", color: "white", padding: "40px 40px 28px", marginTop: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", maxWidth: "1200px", margin: "0 auto" }}>
          <img src="/logo.png" alt="Prime Time Sports" style={{ height: "52px", opacity: 0.85 }} />
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>© 2026 Prime Time Sports. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @keyframes countPop {
          0%   { transform: scale(1.4); opacity: 0.4; }
          100% { transform: scale(1);   opacity: 1;   }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
