"use client";
import React from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import GameDropDownForm from "./GameDropDownForm";

type EntryCreatorInputs = {
  game: string;
  videoTitle: string;
};

const EntryCreatorForm = () => {
  const { register } = useForm<EntryCreatorInputs>();
  const methods = useForm<EntryCreatorInputs>();

  const onSubmit = (data: any) => console.log(data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <NestedInput />
        <input defaultValue="Games" {...register("game")} />
        <input defaultValue="videoTitle" {...register("videoTitle")} />
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
