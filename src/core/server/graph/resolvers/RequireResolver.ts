type RequiredResolver<T> = Omit<Required<T>, "__isTypeOf">;

export default RequiredResolver;
