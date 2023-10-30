import { HttpException, HttpStatus } from '@nestjs/common';

export default (errors) => {
  return new HttpException(
    `${Object.values(errors[0].constraints)[0]}`,
    HttpStatus.BAD_REQUEST,
  );
};
