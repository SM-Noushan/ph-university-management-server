import { Types } from "mongoose";

export type TPreRequisiteCOurses = {
  course: Types.ObjectId;
  isDeleted: boolean;
}[];

export type TCourse = {
  title: string;
  prefix: string;
  code: number;
  credits: number;
  preRequisiteCOurses: TPreRequisiteCOurses;
  isDeleted: boolean;
};
