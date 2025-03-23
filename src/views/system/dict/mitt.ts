import mitt from 'mitt';

/** dictType: string */
type Events = {
  rowClick: string;
};

export const emitter = mitt<Events>();
