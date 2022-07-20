import { RatingRecorder } from '../../lambda/recorders/rating-recorder';

export const testString: string = 'This is my custom recorder, rating is';

export class CustomRatingRecorder implements RatingRecorder { 
    handleRating(rating: number) {
        if (isNaN(rating)){console.log("No");return;}
        console.log(testString + " " + rating);
    }
 }