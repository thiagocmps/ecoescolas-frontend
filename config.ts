// src/config.ts
import Constants from 'expo-constants';

const ENV = Constants.manifest?.extra ?? {};

export const API_BASE_URL = ENV.API_BASE_URL;
