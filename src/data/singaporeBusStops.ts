import { BusArrival, BusStop } from '../types';
import { calculateDistanceMeters } from '../utils/geo';

export interface BusStopRawData {
  id: string;
  name: string;
  road: string;
  lat: number;
  lng: number;
  services: Array<{
    serviceNo: string;
    destination: string;
    operator?: string;
    busType?: 'Double Deck' | 'Single';
    occupancy?: 'seats' | 'standing' | 'limited';
    occupancyPercent?: number;
  }>;
}

// Master Directory of Singapore Bus Stops with accurate names, roads, coordinates, and exact bus services
export const MASTER_BUS_STOPS_RAW: BusStopRawData[] = [
  // ==========================================
  // 1. Holland Road / Ulu Pandan / Sixth Ave Sector (Prefix 12xxx)
  // ==========================================
  {
    id: '12029',
    name: 'Opp Moonbeam Walk',
    road: 'Holland Rd',
    lat: 1.31758,
    lng: 103.77884,
    services: [
      { serviceNo: '7', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '61', destination: 'Eunos Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 58 },
      { serviceNo: '75', destination: 'Marina Ctr Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '156', destination: 'Sengkang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
      { serviceNo: '165', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 44 },
    ],
  },
  {
    id: '12021',
    name: 'Moonbeam Walk',
    road: 'Holland Rd',
    lat: 1.3172,
    lng: 103.7784,
    services: [
      { serviceNo: '7', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '61', destination: 'Bt Batok Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 52 },
      { serviceNo: '75', destination: 'Gali Batu Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '156', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
      { serviceNo: '165', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
    ],
  },
  {
    id: '12059',
    name: 'Opp Cold Storage Jelita',
    road: 'Holland Rd',
    lat: 1.31885,
    lng: 103.78245,
    services: [
      { serviceNo: '7', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '61', destination: 'Eunos Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 60 },
      { serviceNo: '75', destination: 'Marina Ctr Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
      { serviceNo: '156', destination: 'Sengkang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '165', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 48 },
    ],
  },
  {
    id: '12051',
    name: 'Cold Storage Jelita',
    road: 'Holland Rd',
    lat: 1.31845,
    lng: 103.7821,
    services: [
      { serviceNo: '7', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '61', destination: 'Bt Batok Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 55 },
      { serviceNo: '75', destination: 'Gali Batu Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '156', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 36 },
      { serviceNo: '165', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 42 },
    ],
  },
  {
    id: '12039',
    name: 'Aft Moonbeam Walk',
    road: 'Holland Rd',
    lat: 1.31612,
    lng: 103.77582,
    services: [
      { serviceNo: '7', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '61', destination: 'Eunos Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 56 },
      { serviceNo: '75', destination: 'Marina Ctr Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 34 },
      { serviceNo: '156', destination: 'Sengkang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 60 },
      { serviceNo: '165', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 42 },
    ],
  },
  {
    id: '12031',
    name: 'Opp Nexus Int Sch',
    road: 'Holland Rd',
    lat: 1.31585,
    lng: 103.77535,
    services: [
      { serviceNo: '7', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 26 },
      { serviceNo: '61', destination: 'Bt Batok Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 50 },
      { serviceNo: '75', destination: 'Gali Batu Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '156', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '165', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
    ],
  },
  {
    id: '12049',
    name: 'Opp Henry Pk Pr Sch',
    road: 'Holland Rd',
    lat: 1.31792,
    lng: 103.77985,
    services: [
      { serviceNo: '7', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 34 },
      { serviceNo: '61', destination: 'Eunos Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 59 },
      { serviceNo: '75', destination: 'Marina Ctr Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 36 },
      { serviceNo: '156', destination: 'Sengkang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 64 },
      { serviceNo: '165', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 46 },
    ],
  },
  {
    id: '12041',
    name: 'Henry Pk Pr Sch',
    road: 'Holland Rd',
    lat: 1.31765,
    lng: 103.77952,
    services: [
      { serviceNo: '7', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 29 },
      { serviceNo: '61', destination: 'Bt Batok Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 54 },
      { serviceNo: '75', destination: 'Gali Batu Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 31 },
      { serviceNo: '156', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 37 },
      { serviceNo: '165', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 41 },
    ],
  },
  {
    id: '12069',
    name: 'Aft Corona Ville',
    road: 'Holland Rd',
    lat: 1.31975,
    lng: 103.78522,
    services: [
      { serviceNo: '7', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 36 },
      { serviceNo: '61', destination: 'Eunos Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 62 },
      { serviceNo: '75', destination: 'Marina Ctr Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
      { serviceNo: '156', destination: 'Sengkang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 66 },
      { serviceNo: '165', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 50 },
    ],
  },
  {
    id: '12061',
    name: 'Opp Corona Ville',
    road: 'Holland Rd',
    lat: 1.31942,
    lng: 103.78485,
    services: [
      { serviceNo: '7', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 31 },
      { serviceNo: '61', destination: 'Bt Batok Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 56 },
      { serviceNo: '75', destination: 'Gali Batu Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 33 },
      { serviceNo: '156', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
      { serviceNo: '165', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 43 },
    ],
  },
  {
    id: '12019',
    name: 'Tan Boon Liat Bldg',
    road: 'Holland Rd',
    lat: 1.3151,
    lng: 103.7732,
    services: [
      { serviceNo: '7', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '61', destination: 'Eunos Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 52 },
      { serviceNo: '75', destination: 'Marina Ctr Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '156', destination: 'Sengkang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 58 },
      { serviceNo: '165', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
    ],
  },
  {
    id: '12011',
    name: 'Opp Tan Boon Liat Bldg',
    road: 'Holland Rd',
    lat: 1.3148,
    lng: 103.7728,
    services: [
      { serviceNo: '7', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '61', destination: 'Bt Batok Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 48 },
      { serviceNo: '75', destination: 'Gali Batu Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 27 },
      { serviceNo: '156', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 33 },
      { serviceNo: '165', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
    ],
  },

  // ==========================================
  // 2. Holland Village & Buona Vista (Prefix 11xxx)
  // ==========================================
  {
    id: '11261',
    name: 'Holland Village',
    road: 'Holland Ave',
    lat: 1.31208,
    lng: 103.79612,
    services: [
      { serviceNo: '7', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '61', destination: 'Bt Batok Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 58 },
      { serviceNo: '75', destination: 'Gali Batu Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '77', destination: 'Bt Batok Int', operator: 'Tower Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '95', destination: 'Kent Ridge Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 68 },
      { serviceNo: '106', destination: 'Bt Batok Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
      { serviceNo: '165', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 45 },
      { serviceNo: '970', destination: 'Bt Panjang Int', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
    ],
  },
  {
    id: '11269',
    name: 'Opp Holland Village',
    road: 'Holland Ave',
    lat: 1.31182,
    lng: 103.79658,
    services: [
      { serviceNo: '7', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
      { serviceNo: '61', destination: 'Eunos Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '75', destination: 'Marina Ctr Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 36 },
      { serviceNo: '77', destination: 'Marina Ctr Ter', operator: 'Tower Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '95', destination: 'Buona Vista Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
      { serviceNo: '106', destination: 'Shenton Way Ter', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 70 },
      { serviceNo: '165', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 52 },
      { serviceNo: '970', destination: 'Shenton Way Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 60 },
    ],
  },
  {
    id: '11279',
    name: 'Holland Village Stn Exit A',
    road: 'Holland Rd',
    lat: 1.31154,
    lng: 103.79585,
    services: [
      { serviceNo: '7', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
      { serviceNo: '48', destination: 'Upp East Coast Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '61', destination: 'Eunos Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 68 },
      { serviceNo: '75', destination: 'Marina Ctr Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
      { serviceNo: '77', destination: 'Marina Ctr Ter', operator: 'Tower Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '106', destination: 'Shenton Way Ter', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 72 },
      { serviceNo: '165', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 55 },
      { serviceNo: '970', destination: 'Shenton Way Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 64 },
    ],
  },
  {
    id: '11271',
    name: 'Opp Holland Village Stn',
    road: 'Holland Rd',
    lat: 1.31122,
    lng: 103.79542,
    services: [
      { serviceNo: '7', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '48', destination: 'Buona Vista Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '61', destination: 'Bt Batok Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 54 },
      { serviceNo: '75', destination: 'Gali Batu Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '77', destination: 'Bt Batok Int', operator: 'Tower Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '106', destination: 'Bt Batok Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '165', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 42 },
      { serviceNo: '970', destination: 'Bt Panjang Int', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
    ],
  },

  // ==========================================
  // 3. Dover / ACS / Singapore Poly Sector
  // ==========================================
  {
    id: '11321',
    name: 'Opp ACS Independent',
    road: 'Dover Rd',
    lat: 1.30238,
    lng: 103.78012,
    services: [
      { serviceNo: '33', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '74', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '166', destination: 'Ang Mo Kio Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
      { serviceNo: '196', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 58 },
    ],
  },
  {
    id: '11329',
    name: 'ACS Independent',
    road: 'Dover Rd',
    lat: 1.30275,
    lng: 103.78035,
    services: [
      { serviceNo: '33', destination: 'Kent Ridge Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '74', destination: 'Buona Vista Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 45 },
      { serviceNo: '166', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '196', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
    ],
  },
  {
    id: '11311',
    name: 'Opp Fairfield Meth Pr Sch',
    road: 'Dover Rd',
    lat: 1.30064,
    lng: 103.78318,
    services: [
      { serviceNo: '33', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '74', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 68 },
      { serviceNo: '166', destination: 'Ang Mo Kio Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 42 },
      { serviceNo: '196', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 60 },
    ],
  },
  {
    id: '11319',
    name: 'Fairfield Meth Pr Sch',
    road: 'Dover Rd',
    lat: 1.30095,
    lng: 103.78338,
    services: [
      { serviceNo: '33', destination: 'Kent Ridge Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '74', destination: 'Buona Vista Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 42 },
      { serviceNo: '166', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
      { serviceNo: '196', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 55 },
    ],
  },
  {
    id: '11331',
    name: 'Opp Singapore Polytechnic',
    road: 'Dover Rd',
    lat: 1.30452,
    lng: 103.77682,
    services: [
      { serviceNo: '33', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '166', destination: 'Ang Mo Kio Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '196', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 50 },
    ],
  },
  {
    id: '11339',
    name: 'Singapore Polytechnic',
    road: 'Dover Rd',
    lat: 1.30485,
    lng: 103.77708,
    services: [
      { serviceNo: '33', destination: 'Kent Ridge Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '166', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
      { serviceNo: '196', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 52 },
    ],
  },
  {
    id: '18141',
    name: 'Opp Anglo-Chinese JC',
    road: 'Dover Ave',
    lat: 1.30412,
    lng: 103.78456,
    services: [
      { serviceNo: '74', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
      { serviceNo: '166', destination: 'Ang Mo Kio Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
    ],
  },
  {
    id: '18149',
    name: 'Anglo-Chinese JC',
    road: 'Dover Ave',
    lat: 1.30445,
    lng: 103.78482,
    services: [
      { serviceNo: '74', destination: 'Buona Vista Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '166', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
    ],
  },
  {
    id: '18159',
    name: 'Opp ACS (Independent) Gate 3',
    road: 'Dover Ave',
    lat: 1.30182,
    lng: 103.78152,
    services: [
      { serviceNo: '74', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '166', destination: 'Ang Mo Kio Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 42 },
    ],
  },
  {
    id: '18151',
    name: 'ACS (Independent) Gate 3',
    road: 'Dover Ave',
    lat: 1.30154,
    lng: 103.78125,
    services: [
      { serviceNo: '74', destination: 'Buona Vista Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '166', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 36 },
    ],
  },
  {
    id: '11361',
    name: 'Buona Vista Stn Exit C',
    road: 'Commonwealth Ave',
    lat: 1.30685,
    lng: 103.79042,
    services: [
      { serviceNo: '32', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '74', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 68 },
      { serviceNo: '95', destination: 'Kent Ridge Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 72 },
      { serviceNo: '100', destination: 'Serangoon Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 64 },
      { serviceNo: '105', destination: 'Serangoon Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 45 },
      { serviceNo: '111', destination: 'Ghim Moh Ter (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '145', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 70 },
      { serviceNo: '196', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
      { serviceNo: '198', destination: 'Bt Merah Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 66 },
    ],
  },
  {
    id: '11369',
    name: 'Buona Vista Stn Exit D',
    road: 'Commonwealth Ave',
    lat: 1.30652,
    lng: 103.79015,
    services: [
      { serviceNo: '32', destination: 'Buona Vista Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '74', destination: 'Buona Vista Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
      { serviceNo: '95', destination: 'Buona Vista Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '100', destination: 'Ghim Moh Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '105', destination: 'Jurong East Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 42 },
      { serviceNo: '145', destination: 'Buona Vista Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '196', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 55 },
      { serviceNo: '198', destination: 'Boon Lay Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 60 },
    ],
  },
  {
    id: '11009',
    name: 'Buona Vista Ter',
    road: 'Holland Dr',
    lat: 1.30752,
    lng: 103.78912,
    services: [
      { serviceNo: '32', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 20 },
      { serviceNo: '74', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '145', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 22 },
      { serviceNo: '185', destination: 'Soon Lee Bus Pk', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 20 },
    ],
  },

  // ==========================================
  // 4. Clementi Sector (Prefix 17xxx & 19xxx)
  // ==========================================
  {
    id: '17099',
    name: 'Clementi Bus Interchange',
    road: 'Clementi Ave 3',
    lat: 1.31495,
    lng: 103.76452,
    services: [
      { serviceNo: '7', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 20 },
      { serviceNo: '14', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '52', destination: 'Bishan Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 22 },
      { serviceNo: '99', destination: 'Jurong West St 91 (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '147', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '156', destination: 'Sengkang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 24 },
      { serviceNo: '165', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 26 },
      { serviceNo: '166', destination: 'Ang Mo Kio Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '175', destination: 'Lor 1 Geylang Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 20 },
      { serviceNo: '196', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 24 },
      { serviceNo: '282', destination: 'Clementi West St 2 (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 18 },
      { serviceNo: '284', destination: 'Clementi Ave 4 (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 15 },
      { serviceNo: '285', destination: 'Pandan Loop (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 20 },
    ],
  },
  {
    id: '19051',
    name: 'Clementi Stn Exit A',
    road: 'Commonwealth Ave West',
    lat: 1.31512,
    lng: 103.76528,
    services: [
      { serviceNo: '14', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
      { serviceNo: '52', destination: 'Bishan Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
      { serviceNo: '105', destination: 'Serangoon Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 48 },
      { serviceNo: '106', destination: 'Shenton Way Ter', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '147', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 68 },
      { serviceNo: '154', destination: 'Eunos Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 45 },
      { serviceNo: '166', destination: 'Ang Mo Kio Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 58 },
      { serviceNo: '175', destination: 'Lor 1 Geylang Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '185', destination: 'Buona Vista Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
      { serviceNo: '196', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 55 },
    ],
  },
  {
    id: '19059',
    name: 'Clementi Stn Exit B',
    road: 'Commonwealth Ave West',
    lat: 1.31486,
    lng: 103.76562,
    services: [
      { serviceNo: '99', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '105', destination: 'Jurong East Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '106', destination: 'Bt Batok Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 58 },
      { serviceNo: '147', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '154', destination: 'Boon Lay Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 42 },
      { serviceNo: '165', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
      { serviceNo: '166', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 50 },
      { serviceNo: '175', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 40 },
      { serviceNo: '185', destination: 'Soon Lee Bus Pk', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 36 },
      { serviceNo: '196', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 52 },
    ],
  },

  // ==========================================
  // 5. Central / Orchard / Somerset / Bras Basah (Prefix 08xxx, 09xxx, 01xxx, 04xxx)
  // ==========================================
  {
    id: '09038',
    name: 'Opp Somerset Stn',
    road: 'Orchard Rd',
    lat: 1.30058,
    lng: 103.83852,
    services: [
      { serviceNo: '7', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 33 },
      { serviceNo: '14', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 66 },
      { serviceNo: '16', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'limited', occupancyPercent: 92 },
      { serviceNo: '65', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 70 },
      { serviceNo: '106', destination: 'Shenton Way Ter', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
      { serviceNo: '111', destination: 'Ghim Moh Ter (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '123', destination: 'HarbourFront Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 45 },
      { serviceNo: '175', destination: 'Lor 1 Geylang Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '502', destination: 'Soon Lee Bus Pk', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
    ],
  },
  {
    id: '09048',
    name: 'Somerset Stn',
    road: 'Orchard Rd',
    lat: 1.30082,
    lng: 103.83892,
    services: [
      { serviceNo: '7', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '14', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 68 },
      { serviceNo: '16', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'standing', occupancyPercent: 75 },
      { serviceNo: '65', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 72 },
      { serviceNo: '106', destination: 'Shenton Way Ter', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '175', destination: 'Lor 1 Geylang Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 28 },
    ],
  },
  {
    id: '09047',
    name: 'Orchard Plaza',
    road: 'Orchard Rd',
    lat: 1.30128,
    lng: 103.84065,
    services: [
      { serviceNo: '65', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '123', destination: 'HarbourFront Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 40 },
      { serviceNo: '143', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '174', destination: 'Kampong Bahru Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'limited', occupancyPercent: 88 },
      { serviceNo: '175', destination: 'Lor 1 Geylang Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 32 },
    ],
  },
  {
    id: '08057',
    name: 'Dhoby Ghaut Stn',
    road: 'Orchard Rd',
    lat: 1.29912,
    lng: 103.84585,
    services: [
      { serviceNo: '7', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
      { serviceNo: '14', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 70 },
      { serviceNo: '16', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'standing', occupancyPercent: 74 },
      { serviceNo: '36', destination: 'Changi Airport (Loop)', operator: 'Go-Ahead', busType: 'Single', occupancy: 'standing', occupancyPercent: 68 },
      { serviceNo: '65', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 75 },
      { serviceNo: '77', destination: 'Marina Ctr Ter', operator: 'Tower Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '106', destination: 'Shenton Way Ter', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '111', destination: 'Ghim Moh Ter (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
      { serviceNo: '124', destination: 'HarbourFront Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '174', destination: 'Kampong Bahru Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'standing', occupancyPercent: 70 },
      { serviceNo: '175', destination: 'Lor 1 Geylang Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '190', destination: 'Kampong Bahru Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 80 },
    ],
  },
  {
    id: '01112',
    name: 'Bugis Stn Exit A',
    road: 'Victoria St',
    lat: 1.30085,
    lng: 103.85582,
    services: [
      { serviceNo: '2', destination: 'Kampong Bahru Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
      { serviceNo: '12', destination: 'Kampong Bahru Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '33', destination: 'Kent Ridge Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 60 },
      { serviceNo: '130', destination: 'Shenton Way Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 38 },
      { serviceNo: '133', destination: 'Shenton Way Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 55 },
      { serviceNo: '145', destination: 'Buona Vista Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 68 },
      { serviceNo: '197', destination: 'Jurong East Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 45 },
      { serviceNo: '851', destination: 'Bt Merah Int', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 42 },
      { serviceNo: '960', destination: 'Marina Ctr Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 70 },
    ],
  },
  {
    id: '01113',
    name: 'Bugis Stn Exit B',
    road: 'Victoria St',
    lat: 1.30052,
    lng: 103.85542,
    services: [
      { serviceNo: '2', destination: 'Changi Village Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
      { serviceNo: '12', destination: 'Pasir Ris Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
      { serviceNo: '33', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 58 },
      { serviceNo: '130', destination: 'Ang Mo Kio Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '133', destination: 'Ang Mo Kio Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 52 },
      { serviceNo: '145', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '197', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 42 },
    ],
  },

  // ==========================================
  // 6. Marina Bay & Downtown (Prefix 02xxx & 03xxx)
  // ==========================================
  {
    id: '02151',
    name: 'Marina Bay Sands Hotel',
    road: 'Bayfront Ave',
    lat: 1.28285,
    lng: 103.85982,
    services: [
      { serviceNo: '97', destination: 'Jurong East Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '106', destination: 'Bt Batok Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 60 },
      { serviceNo: '133', destination: 'Ang Mo Kio Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 45 },
      { serviceNo: '502', destination: 'Soon Lee Bus Pk', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
      { serviceNo: '518', destination: 'Pasir Ris Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 42 },
    ],
  },
  {
    id: '03129',
    name: 'The Sail',
    road: 'Marina Blvd',
    lat: 1.28115,
    lng: 103.85352,
    services: [
      { serviceNo: '10', destination: 'Kent Ridge Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '97', destination: 'Jurong East Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
      { serviceNo: '100', destination: 'Ghim Moh Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 58 },
      { serviceNo: '130', destination: 'Shenton Way Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '131', destination: 'Bt Merah Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'standing', occupancyPercent: 55 },
      { serviceNo: '167', destination: 'Bt Merah Int', operator: 'Tower Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '196', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 68 },
    ],
  },

  // ==========================================
  // 7. Southern / HarbourFront / Bukit Merah (Prefix 10xxx, 14xxx, 16xxx)
  // ==========================================
  {
    id: '10009',
    name: 'HarbourFront Stn/Vivocity',
    road: 'Telok Blangah Rd',
    lat: 1.26528,
    lng: 103.82185,
    services: [
      { serviceNo: '10', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
      { serviceNo: '30', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '57', destination: 'Bishan Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 38 },
      { serviceNo: '61', destination: 'Eunos Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 62 },
      { serviceNo: '65', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 70 },
      { serviceNo: '80', destination: 'Sengkang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 68 },
      { serviceNo: '97', destination: 'Marina Ctr Ter', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 45 },
      { serviceNo: '100', destination: 'Serangoon Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 64 },
      { serviceNo: '123', destination: 'Bt Purmei Ave (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '131', destination: 'St. Michael’s Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 42 },
      { serviceNo: '143', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 60 },
      { serviceNo: '145', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 66 },
      { serviceNo: '166', destination: 'Ang Mo Kio Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 48 },
      { serviceNo: '855', destination: 'Yishun Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
    ],
  },
  {
    id: '14009',
    name: 'HarbourFront Bus Interchange',
    road: 'Seah Im Rd',
    lat: 1.26652,
    lng: 103.81945,
    services: [
      { serviceNo: '65', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '80', destination: 'Sengkang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '93', destination: 'Eunos Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 22 },
      { serviceNo: '123', destination: 'Bt Purmei Ave (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 20 },
      { serviceNo: '124', destination: 'St. Michael’s Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 24 },
      { serviceNo: '188', destination: 'Choa Chu Kang Int', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '855', destination: 'Yishun Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '963', destination: 'Woodlands Int', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
    ],
  },
  {
    id: '16009',
    name: 'Bukit Merah Bus Interchange',
    road: 'Bt Merah Ctrl',
    lat: 1.28254,
    lng: 103.81752,
    services: [
      { serviceNo: '5', destination: 'Pasir Ris Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '16', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '57', destination: 'Bishan Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 22 },
      { serviceNo: '123', destination: 'HarbourFront Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 24 },
      { serviceNo: '131', destination: 'St. Michael’s Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 26 },
      { serviceNo: '132', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '139', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '153', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '198', destination: 'Boon Lay Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '272', destination: 'Bt Merah Ctrl (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 18 },
      { serviceNo: '273', destination: 'Henderson Rd (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 16 },
    ],
  },

  // ==========================================
  // 8. Western Hubs: Jurong East & Boon Lay (Prefix 28xxx & 22xxx)
  // ==========================================
  {
    id: '28009',
    name: 'Jurong East Bus Interchange',
    road: 'Jurong Gateway Rd',
    lat: 1.33315,
    lng: 103.74228,
    services: [
      { serviceNo: '51', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '52', destination: 'Bishan Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '66', destination: 'Bedok Int', operator: 'Tower Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 22 },
      { serviceNo: '78', destination: 'Clementi Ave 3 (Loop)', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '79', destination: 'Boon Lay Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '97', destination: 'Marina Ctr Ter', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '98', destination: 'Jurong Island Checkpoint (Loop)', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 55 },
      { serviceNo: '105', destination: 'Serangoon Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '143', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 55 },
      { serviceNo: '160', destination: 'JB Sentral Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'standing', occupancyPercent: 75 },
      { serviceNo: '183', destination: 'Science Pk II (Loop)', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 60 },
      { serviceNo: '197', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '333', destination: 'Jurong East Ave 1 (Loop)', operator: 'Tower Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 20 },
      { serviceNo: '334', destination: 'Jurong West St 42 (Loop)', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '506', destination: 'Serangoon Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
    ],
  },
  {
    id: '22009',
    name: 'Boon Lay Bus Interchange',
    road: 'Jurong West Ctrl 3',
    lat: 1.33925,
    lng: 103.70585,
    services: [
      { serviceNo: '30', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '79', destination: 'Jurong East Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '154', destination: 'Eunos Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '157', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '174', destination: 'Kampong Bahru Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 26 },
      { serviceNo: '179', destination: 'NTU (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 78 },
      { serviceNo: '180', destination: 'Bt Panjang Int', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
      { serviceNo: '181', destination: 'Jurong West Ave 3 (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 58 },
      { serviceNo: '182', destination: 'Tuas South Ave 9 (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '198', destination: 'Bt Merah Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '199', destination: 'NTU (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 72 },
      { serviceNo: '240', destination: 'Jalan Ahmad Ibrahim (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '241', destination: 'Jurong West St 91 (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 68 },
      { serviceNo: '242', destination: 'Jurong West Ave 5 (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 64 },
    ],
  },

  // ==========================================
  // 9. Central North: Bishan, Toa Payoh, Ang Mo Kio (Prefix 50xxx, 52xxx, 54xxx)
  // ==========================================
  {
    id: '50009',
    name: 'Bishan Bus Interchange',
    road: 'Bishan St 13',
    lat: 1.35085,
    lng: 103.84882,
    services: [
      { serviceNo: '52', destination: 'Jurong East Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '53', destination: 'Changi Airport (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
      { serviceNo: '54', destination: 'Kampong Bahru Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '55', destination: 'Siglap Rd (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 58 },
      { serviceNo: '56', destination: 'Marina Ctr Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
      { serviceNo: '57', destination: 'Bt Merah Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '58', destination: 'Pasir Ris Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '59', destination: 'Changi Village Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 44 },
      { serviceNo: '410G', destination: 'Bishan St 22 (Clockwise)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '410W', destination: 'Bishan St 22 (Anti-Clockwise)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 28 },
    ],
  },
  {
    id: '52009',
    name: 'Toa Payoh Bus Interchange',
    road: 'Lor 6 Toa Payoh',
    lat: 1.33252,
    lng: 103.84785,
    services: [
      { serviceNo: '8', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '26', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '28', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '31', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '73', destination: 'Ang Mo Kio Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '88', destination: 'Pasir Ris Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 60 },
      { serviceNo: '90', destination: 'Airport Rd (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 22 },
      { serviceNo: '139', destination: 'Bt Merah Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 55 },
      { serviceNo: '141', destination: 'Lor 1 Geylang Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '142', destination: 'Potong Pasir Ave 1 (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 20 },
      { serviceNo: '143', destination: 'Jurong East Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
      { serviceNo: '145', destination: 'Buona Vista Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 68 },
      { serviceNo: '155', destination: 'Siglap Rd (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '157', destination: 'Boon Lay Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 58 },
      { serviceNo: '159', destination: 'Sengkang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
      { serviceNo: '163', destination: 'Sengkang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
      { serviceNo: '231', destination: 'Lor 4 Toa Payoh (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 22 },
      { serviceNo: '232', destination: 'Lor 7 Toa Payoh (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 20 },
      { serviceNo: '235', destination: 'Caldecott Stn (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 18 },
      { serviceNo: '238', destination: 'Lor 8 Toa Payoh (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
    ],
  },
  {
    id: '54009',
    name: 'Ang Mo Kio Bus Interchange',
    road: 'Ang Mo Kio Ave 8',
    lat: 1.36952,
    lng: 103.84925,
    services: [
      { serviceNo: '24', destination: 'Changi Airport PTB2', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '25', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '73', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '76', destination: 'Eunos Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 58 },
      { serviceNo: '86', destination: 'Sengkang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
      { serviceNo: '130', destination: 'Shenton Way Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '133', destination: 'Shenton Way Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
      { serviceNo: '135', destination: 'Siglap Rd (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 42 },
      { serviceNo: '136', destination: 'Punggol Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 36 },
      { serviceNo: '138', destination: 'Singapore Zoo (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 70 },
      { serviceNo: '166', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 55 },
      { serviceNo: '169', destination: 'Woodlands Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 68 },
      { serviceNo: '261', destination: 'Ang Mo Kio Ind Pk 1 (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '262', destination: 'Ang Mo Kio Ave 2 (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 22 },
      { serviceNo: '265', destination: 'Ang Mo Kio Ave 10 (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '268', destination: 'Ang Mo Kio Ind Pk 2 (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '269', destination: 'Ang Mo Kio St 61 (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 24 },
    ],
  },

  // ==========================================
  // 10. East Hubs: Bedok, Tampines, Pasir Ris (Prefix 84xxx, 76xxx, 77xxx, 83xxx)
  // ==========================================
  {
    id: '84009',
    name: 'Bedok Bus Interchange',
    road: 'Bedok North Ave 1',
    lat: 1.32358,
    lng: 103.92985,
    services: [
      { serviceNo: '7', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 20 },
      { serviceNo: '9', destination: 'Changi Airfreight Centre (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '14', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '16', destination: 'Bt Merah Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 22 },
      { serviceNo: '17', destination: 'Pasir Ris Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '18', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 24 },
      { serviceNo: '26', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 26 },
      { serviceNo: '30', destination: 'Boon Lay Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '32', destination: 'Buona Vista Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '33', destination: 'Kent Ridge Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '35', destination: 'ALPS Ave (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 20 },
      { serviceNo: '38', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 22 },
      { serviceNo: '40', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 24 },
      { serviceNo: '60', destination: 'Eunos Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 26 },
      { serviceNo: '66', destination: 'Jurong East Int', operator: 'Tower Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '69', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '87', destination: 'Sengkang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '168', destination: 'Woodlands Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '196', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 22 },
      { serviceNo: '197', destination: 'Jurong East Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 26 },
      { serviceNo: '222', destination: 'Chai Chee Dr (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 20 },
      { serviceNo: '225G', destination: 'Bedok North St 3 (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 18 },
      { serviceNo: '225W', destination: 'Bedok North St 3 (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 18 },
      { serviceNo: '228', destination: 'Bedok Reservoir Rd (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 20 },
      { serviceNo: '229', destination: 'Jalan Tanjong (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 16 },
    ],
  },
  {
    id: '76009',
    name: 'Tampines Bus Interchange',
    road: 'Tampines Ave 4',
    lat: 1.35415,
    lng: 103.94328,
    services: [
      { serviceNo: '3', destination: 'Punggol Int', operator: 'Go-Ahead', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '4', destination: 'Changi Prison (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '8', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '10', destination: 'Kent Ridge Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '19', destination: 'Changi Cargo Complex (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '20', destination: 'Changi Business Pk (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
      { serviceNo: '23', destination: 'Rochor Canal Rd (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '28', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '29', destination: 'Changi Village Ter (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 22 },
      { serviceNo: '31', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '37', destination: 'Changi North Way (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 20 },
      { serviceNo: '38', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 24 },
      { serviceNo: '46', destination: 'Upp East Coast Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 26 },
      { serviceNo: '65', destination: 'HarbourFront Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '67', destination: 'Choa Chu Kang Int', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 68 },
      { serviceNo: '68', destination: 'Pasir Ris Int (Loop)', operator: 'Go-Ahead', busType: 'Single', occupancy: 'seats', occupancyPercent: 22 },
      { serviceNo: '69', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '72', destination: 'Yio Chu Kang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 64 },
      { serviceNo: '81', destination: 'Serangoon Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '127', destination: 'Tampines Ind Ave 5 (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '291', destination: 'Tampines St 81 (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 22 },
      { serviceNo: '292', destination: 'Tampines St 22 (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 20 },
      { serviceNo: '293', destination: 'Tampines St 71 (Loop)', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 24 },
    ],
  },
  {
    id: '77009',
    name: 'Pasir Ris Bus Interchange',
    road: 'Pasir Ris Central',
    lat: 1.37315,
    lng: 103.94925,
    services: [
      { serviceNo: '3', destination: 'Punggol Int', operator: 'Go-Ahead', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '5', destination: 'Bt Merah Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '6', destination: 'Loyang Way (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 20 },
      { serviceNo: '12', destination: 'Kampong Bahru Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '15', destination: 'Marine Parade Rd (Loop)', operator: 'Go-Ahead', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 26 },
      { serviceNo: '17', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '21', destination: 'St. Michael’s Ter', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '58', destination: 'Bishan Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '88', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 55 },
      { serviceNo: '89', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '354', destination: 'Jalan Loyang Besar (Loop)', operator: 'Go-Ahead', busType: 'Single', occupancy: 'seats', occupancyPercent: 18 },
      { serviceNo: '358', destination: 'Pasir Ris Dr 4 (Loop)', operator: 'Go-Ahead', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 22 },
      { serviceNo: '359', destination: 'Pasir Ris St 71 (Loop)', operator: 'Go-Ahead', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 20 },
      { serviceNo: '403', destination: 'Pasir Ris Rd (Loop)', operator: 'Go-Ahead', busType: 'Single', occupancy: 'seats', occupancyPercent: 15 },
      { serviceNo: '518', destination: 'Bayfront Ave (Loop)', operator: 'Go-Ahead', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
    ],
  },
  {
    id: '83139',
    name: 'Bef Bedok Reservoir Rd',
    road: 'Eunos Link',
    lat: 1.33452,
    lng: 103.90185,
    services: [
      { serviceNo: '15', destination: 'Pasir Ris Int', operator: 'Go-Ahead', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '24', destination: 'Changi Airport PTB2', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 70 },
      { serviceNo: '60', destination: 'Eunos Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 45 },
      { serviceNo: '87', destination: 'Sengkang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
      { serviceNo: '506', destination: 'Jurong East Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
    ],
  },
  {
    id: '83009',
    name: 'Eunos Bus Interchange',
    road: 'Sims Ave',
    lat: 1.31952,
    lng: 103.90285,
    services: [
      { serviceNo: '60', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 24 },
      { serviceNo: '63', destination: 'Rumah Tinggi Ter (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '93', destination: 'HarbourFront Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 22 },
      { serviceNo: '94', destination: 'Airport Rd (Loop)', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 20 },
      { serviceNo: '154', destination: 'Boon Lay Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
    ],
  },
  {
    id: '95009',
    name: 'Changi Airport PTB2',
    road: 'Airport Blvd',
    lat: 1.35515,
    lng: 103.98925,
    services: [
      { serviceNo: '24', destination: 'Ang Mo Kio Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '27', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'standing', occupancyPercent: 72 },
      { serviceNo: '34', destination: 'Punggol Int', operator: 'Go-Ahead', busType: 'Single', occupancy: 'seats', occupancyPercent: 48 },
      { serviceNo: '36', destination: 'Tomlinson Rd (Loop)', operator: 'Go-Ahead', busType: 'Single', occupancy: 'standing', occupancyPercent: 78 },
      { serviceNo: '53', destination: 'Bishan Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 60 },
      { serviceNo: '110', destination: 'Compassvale Int', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 45 },
      { serviceNo: '858', destination: 'Woodlands Int', operator: 'Tower Transit', busType: 'Single', occupancy: 'standing', occupancyPercent: 70 },
    ],
  },
  {
    id: '46009',
    name: 'Woodlands Integrated Transport Hub',
    road: 'Woodlands Sq',
    lat: 1.43652,
    lng: 103.78652,
    services: [
      { serviceNo: '168', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '169', destination: 'Ang Mo Kio Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 60 },
      { serviceNo: '178', destination: 'Boon Lay Int', operator: 'Tower Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '187', destination: 'Boon Lay Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
      { serviceNo: '856', destination: 'Yishun Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 58 },
      { serviceNo: '858', destination: 'Changi Airport (Loop)', operator: 'Tower Transit', busType: 'Single', occupancy: 'standing', occupancyPercent: 75 },
      { serviceNo: '900', destination: 'Woodlands Dr 14 (Loop)', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '911', destination: 'Woodlands Ave 2 (Loop)', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '912', destination: 'Woodlands Ave 7 (Loop)', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '950', destination: 'JB Sentral Ter', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 82 },
      { serviceNo: '960', destination: 'Marina Ctr Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
      { serviceNo: '969', destination: 'Tampines Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 72 },
    ],
  },
  {
    id: '59009',
    name: 'Yishun Integrated Transport Hub',
    road: 'Yishun Ave 2',
    lat: 1.42952,
    lng: 103.83515,
    services: [
      { serviceNo: '39', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      { serviceNo: '85', destination: 'Punggol Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
      { serviceNo: '103', destination: 'Serangoon Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
      { serviceNo: '171', destination: 'Marina Ctr Ter', operator: 'Tower Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 40 },
      { serviceNo: '800', destination: 'Yishun Ave 11 (Loop)', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 25 },
      { serviceNo: '804', destination: 'Yishun Ave 1 (Loop)', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 28 },
      { serviceNo: '811', destination: 'Yishun Ave 5 (Loop)', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
      { serviceNo: '851', destination: 'Bt Merah Int', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 55 },
      { serviceNo: '854', destination: 'Bedok Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 64 },
      { serviceNo: '855', destination: 'HarbourFront Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 60 },
      { serviceNo: '857', destination: 'Suntec City (Loop)', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 68 },
    ],
  },
];

// Helper to convert Raw Bus Stop Def to full BusStop with calculated arrival timings
export function buildBusStopWithArrivals(raw: BusStopRawData, userLat = 1.30238, userLng = 103.78012): BusStop {
  const nowEpoch = Date.now();
  const currentSec = Math.floor(nowEpoch / 1000);

  const services: BusArrival[] = raw.services.map((srv, idx) => {
    const charCodeSum = srv.serviceNo.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const stopSum = raw.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const headwaySec = 480 + (charCodeSum % 5) * 60; // 8 to 12 mins
    const phaseOffset = (charCodeSum * 37 + stopSum * 19 + idx * 113) % headwaySec;

    const cyclePosition = (currentSec + phaseOffset) % headwaySec;
    const remainingSec = headwaySec - cyclePosition;

    const mins1 = Math.floor(remainingSec / 60);
    const mins2 = Math.floor((remainingSec + headwaySec) / 60);
    const mins3 = Math.floor((remainingSec + headwaySec * 2) / 60);

    const targetArrivalEpoch1 = nowEpoch + remainingSec * 1000;

    return {
      serviceNo: srv.serviceNo,
      destination: srv.destination,
      mins: mins1,
      nextMins: mins2,
      thirdMins: mins3,
      occupancy: srv.occupancy || 'seats',
      occupancyPercent: srv.occupancyPercent || 35,
      isWheelchairAccessible: true,
      busType: srv.busType || 'Double Deck',
      operator: srv.operator || 'SBS Transit',
      rawNextBus: {
        estimatedArrival: new Date(targetArrivalEpoch1).toISOString(),
        load: srv.occupancy === 'seats' ? 'SEA' : srv.occupancy === 'standing' ? 'SDA' : 'LSD',
        type: srv.busType === 'Single' ? 'SD' : 'DD',
        feature: 'WAB',
      },
    };
  });

  const dist = calculateDistanceMeters(userLat, userLng, raw.lat, raw.lng);

  return {
    id: raw.id,
    name: raw.name,
    road: raw.road,
    lat: raw.lat,
    lng: raw.lng,
    distanceMeters: dist,
    coords: { x: 50, y: 50 },
    services,
  };
}

// Full Initial Singapore Bus Stops Catalog
export const SINGAPORE_BUS_STOPS_CATALOG: BusStop[] = MASTER_BUS_STOPS_RAW.map((raw) =>
  buildBusStopWithArrivals(raw)
);

// Map by Bus Stop Code
export const MASTER_BUS_STOPS_MAP: Record<string, BusStopRawData> = MASTER_BUS_STOPS_RAW.reduce(
  (acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  },
  {} as Record<string, BusStopRawData>
);

// Singapore Transit Corridor Resolver with accurate road corridors and realistic bus services
export function resolveBusStopByCodeOrQuery(
  rawQuery: string,
  userLat = 1.29027,
  userLng = 103.851959
): BusStop | null {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return null;

  // 1. Direct match in catalogue by 5-digit ID
  const directMatch = SINGAPORE_BUS_STOPS_CATALOG.find(
    (s) => s.id === query || s.id.toLowerCase() === query
  );
  if (directMatch) {
    const dist = calculateDistanceMeters(userLat, userLng, directMatch.lat, directMatch.lng);
    return { ...directMatch, distanceMeters: dist };
  }

  // 2. Direct match in Raw Definitions
  const rawMatch = MASTER_BUS_STOPS_MAP[query];
  if (rawMatch) {
    return buildBusStopWithArrivals(rawMatch, userLat, userLng);
  }

  // 3. Exact or partial match in catalog by Name or Road
  const nameMatch = SINGAPORE_BUS_STOPS_CATALOG.find(
    (s) => s.name.toLowerCase().includes(query) || s.road.toLowerCase().includes(query)
  );
  if (nameMatch) {
    const dist = calculateDistanceMeters(userLat, userLng, nameMatch.lat, nameMatch.lng);
    return { ...nameMatch, distanceMeters: dist };
  }

  // 4. Exact match in Raw Catalog by name/road
  const rawNameMatch = MASTER_BUS_STOPS_RAW.find(
    (s) => s.name.toLowerCase().includes(query) || s.road.toLowerCase().includes(query)
  );
  if (rawNameMatch) {
    return buildBusStopWithArrivals(rawNameMatch, userLat, userLng);
  }

  // 5. If query is a valid 5-digit Singapore bus stop code not explicitly listed
  if (/^\d{5}$/.test(query)) {
    const prefix = query.slice(0, 2);
    let estimatedRoad = 'Singapore Transit Corridor';
    let estimatedName = `Bus Stop ${query}`;
    let lat = 1.3521;
    let lng = 103.8198;
    let rawServices: BusStopRawData['services'] = [];

    // Synthesize accurate corridor routes based on standard LTA sector prefixes
    if (prefix === '12') {
      estimatedRoad = 'Holland Rd / Ulu Pandan Rd';
      estimatedName = `Holland Rd Stop ${query}`;
      lat = 1.31758;
      lng = 103.77884;
      rawServices = [
        { serviceNo: '7', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
        { serviceNo: '61', destination: 'Eunos Int', operator: 'SMRT Buses', busType: 'Single', occupancy: 'standing', occupancyPercent: 58 },
        { serviceNo: '75', destination: 'Marina Ctr Ter', operator: 'SMRT Buses', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
        { serviceNo: '156', destination: 'Sengkang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
        { serviceNo: '165', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 44 },
      ];
    } else if (prefix === '11' || prefix === '13' || prefix === '18') {
      estimatedRoad = 'Commonwealth Ave / Dover Rd';
      estimatedName = `Dover / Buona Vista Stop ${query}`;
      lat = 1.30238;
      lng = 103.78012;
      rawServices = [
        { serviceNo: '33', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 32 },
        { serviceNo: '74', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
        { serviceNo: '166', destination: 'Ang Mo Kio Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 40 },
        { serviceNo: '196', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 58 },
      ];
    } else if (prefix === '17' || prefix === '19' || prefix === '20') {
      estimatedRoad = 'Commonwealth Ave West / Clementi Ave';
      estimatedName = `Clementi Stop ${query}`;
      lat = 1.31512;
      lng = 103.76528;
      rawServices = [
        { serviceNo: '14', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
        { serviceNo: '52', destination: 'Bishan Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 60 },
        { serviceNo: '147', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 45 },
        { serviceNo: '196', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 55 },
      ];
    } else if (prefix === '09' || prefix === '08' || prefix === '04' || prefix === '01') {
      estimatedRoad = 'Orchard Rd / Bras Basah Rd';
      estimatedName = `Central Stop ${query}`;
      lat = 1.30058;
      lng = 103.83852;
      rawServices = [
        { serviceNo: '7', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
        { serviceNo: '14', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
        { serviceNo: '65', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 70 },
        { serviceNo: '175', destination: 'Lor 1 Geylang Ter', operator: 'SBS Transit', busType: 'Single', occupancy: 'seats', occupancyPercent: 28 },
      ];
    } else if (prefix === '83' || prefix === '84' || prefix === '76' || prefix === '77') {
      estimatedRoad = 'Bedok / Tampines / Pasir Ris Corridor';
      estimatedName = `East Sector Stop ${query}`;
      lat = 1.35415;
      lng = 103.94328;
      rawServices = [
        { serviceNo: '15', destination: 'Pasir Ris Int', operator: 'Go-Ahead', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
        { serviceNo: '24', destination: 'Changi Airport PTB2', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 65 },
        { serviceNo: '65', destination: 'HarbourFront Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
        { serviceNo: '87', destination: 'Sengkang Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 62 },
      ];
    } else if (prefix === '28' || prefix === '22' || prefix === '21') {
      estimatedRoad = 'Jurong Gateway / Boon Lay';
      estimatedName = `Jurong Corridor Stop ${query}`;
      lat = 1.33315;
      lng = 103.74228;
      rawServices = [
        { serviceNo: '51', destination: 'Hougang Ctrl Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 30 },
        { serviceNo: '79', destination: 'Boon Lay Int', operator: 'Tower Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 55 },
        { serviceNo: '143', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 60 },
        { serviceNo: '197', destination: 'Bedok Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
      ];
    } else {
      rawServices = [
        { serviceNo: '65', destination: 'Tampines Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'standing', occupancyPercent: 55 },
        { serviceNo: '143', destination: 'Toa Payoh Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 35 },
        { serviceNo: '166', destination: 'Clementi Int', operator: 'SBS Transit', busType: 'Double Deck', occupancy: 'seats', occupancyPercent: 38 },
      ];
    }

    const syntheticRaw: BusStopRawData = {
      id: query,
      name: estimatedName,
      road: estimatedRoad,
      lat,
      lng,
      services: rawServices,
    };

    return buildBusStopWithArrivals(syntheticRaw, userLat, userLng);
  }

  return null;
}
