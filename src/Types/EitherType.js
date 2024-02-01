import { Type } from './Type.js';

export class EitheryType extends Type {

  constructor(leftType, rightType) {
    super('eithery');
    this.leftType = leftType; 
    this.rightType = rightType;
  }

  verify(value) {
    if (!value || typeof value !== 'object' || value.constructor !== Object) {
      throw new Error('Value must be an object'); 
    }

    if (!('left' in value) && !('right' in value)) {
      throw new Error('Value must contain either "left" or "right" property');
    }

    if ('left' in value) {
      this.leftType.verify(value.left);
    }

    if ('right' in value) {
      this.rightType.verify(value.right);
    }
  }

  toString() {
    return `eithery(${this.leftType}, ${this.rightType})`; 
  }

  encode(value, write) {
    this.verify(value);

    if ('left' in value) {
      write('left');
      this.leftType.encode(value.left, write);
    } else {
      write('right');
      this.rightType.encode(value.right, write);
    }
  }

  decode(read) {
    const tag = read();
    let value;

    if (tag === 'left') {
      value = {left: this.leftType.decode(read)};
    } else {
      value = {right: this.rightType.decode(read)};
    }

    return value;
  }

}