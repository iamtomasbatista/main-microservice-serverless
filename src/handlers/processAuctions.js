import createError from 'http-errors';
import { closeAuction } from '../lib/closeAuction';
import { getEndedAuctions } from '../lib/getEndedAuctions';

async function processAuctions(event, context) {  
  try {
    const auctionsToClose = await getEndedAuctions();
    const closePromises = auctionsToClose.map(auction => closeAuction(auction));
    await Promise.all(closePromises);     // 📝ES6 Await until all the promises was closed 
    return { closed: closePromises.length };      //📝AWS this fn can returns anything (rather than an HTTP response) coz it is not triggered by AWS API Gateway. In other words, this is an auxiliary fn not a lambda!
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = processAuctions;