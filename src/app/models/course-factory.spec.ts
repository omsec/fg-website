import { CourseFactory } from './course-factory';

describe('CourseFactory', () => {
  it('should create an instance', () => {
    expect(new CourseFactory()).toBeTruthy();
  });
});
