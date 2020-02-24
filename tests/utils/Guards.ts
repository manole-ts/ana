// tslint:disable
import {
    IntersectionType,
    ObjectFlags,
    ObjectType,
    Type,
    TypeFlags,
    TypeReference,
    TypeVariable,
    UnionType
} from "typescript";

/* @internal */
// Intrinsic types (TypeFlags.Intrinsic)
export interface IntrinsicType extends Type {
    intrinsicName: string;        // Name of intrinsic type
    objectFlags: ObjectFlags;
}

/* @internal */
export interface NullableType extends IntrinsicType {
    objectFlags: ObjectFlags;
}

type union = UnionType & { objectFlags: ObjectFlags };
type intersection = IntersectionType & { objectFlags: ObjectFlags };

export type ObjectFlagsType = NullableType | ObjectType | union | intersection;

const nullableFlag = TypeFlags.Undefined | TypeFlags.Null;

const objectFlag = nullableFlag | TypeFlags.Never | TypeFlags.Object | TypeFlags.Union | TypeFlags.Intersection;


export const isTypeReference = (type: Type): type is TypeReference => !!(getObjectFlags(type) & ObjectFlags.Reference);

export const isTypeVariable = (type: Type): type is TypeVariable => !!(type.flags & TypeFlags.TypeVariable);

const getObjectFlags = (type: Type) => type.flags & objectFlag ? (<ObjectFlagsType>type).objectFlags : 0;
