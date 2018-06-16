import { FilterQuery } from 'mongodb';
import { Writeable } from '../../common/types';

export type FilterQuery<T> = Writeable<Partial<T>> &
    FilterQuery<Writeable<Partial<T>>>;
