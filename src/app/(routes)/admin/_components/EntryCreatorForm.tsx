"use client";
import React from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import GameDropDownForm from "./GameDropDownForm";
import { Player } from "@prisma/client";

type EntryCreatorInputs = {
  game: string;
  videoTitle: string;
  players: Player[];
};

const EntryCreatorForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<EntryCreatorInputs>({
    resolver: zodResolver(schema),
  });
  console.log(errors);

  const onSubmit = (data: any) => console.log(data);

  return (
    <FormProvider>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NestedInput />
        <input
          defaultValue="Games"
          {...register("game", { required: "Game is required!" })}
        />
        <input
          defaultValue="videoTitle"
          {...register("videoTitle", { required: true })}
        />
        <GameDropDownForm />
        <input type="submit" />
        {/* register your input into the hook by invoking the "register" function */}
      </form>
    </FormProvider>
  );
};

function NestedInput() {
  const { register } = useFormContext(); // retrieve all hook methods

  return <input {...register("test")} />;
}

export default EntryCreatorForm;
