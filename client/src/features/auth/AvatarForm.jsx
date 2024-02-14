import { useSelector } from "react-redux";
import { selectCurrentUser } from "./authSlice";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSendUpdateAvatarMutation } from "./authApiSlice";
import Form from "../../components/Form";
import { HiCheck } from "react-icons/hi2";

import InputMsg from "../../components/InputMsg";
import Button from "../../components/Button";
import Avatar from "../../components/Avatar";
import Input from "../../components/Input";
import { EmptyAvatar } from "../../components/Icons";

function AvatarForm() {
  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm({
    defaultValues: {
      avatar: [],
    },
  });

  const [sendUpdateAvatar, { isLoading, isSuccess, isError }] =
    useSendUpdateAvatarMutation();

  const currentUser = useSelector(selectCurrentUser);
  const [msgFromServer, setMsgFromServer] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      reset({
        avatar: [],
      });
    }
  }, [isSuccess]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("avatar", data.avatar[0]);
      const res = await sendUpdateAvatar(formData).unwrap();
      setMsgFromServer(res);
    } catch (err) {
      setMsgFromServer({
        status: err.data?.status,
        message: err.data?.message,
      });
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {isDirty && !isError && !isSuccess && null}
      {!isDirty && !isError && isSuccess && (
        <InputMsg msgFromServer={msgFromServer} isFromServer={true} />
      )}
      {isDirty && isError && !isSuccess && (
        <InputMsg msgFromServer={msgFromServer} isFromServer={true} />
      )}

      <span className="font-roboto text-base font-medium uppercase sm:text-xl">
        Ảnh đại diện
      </span>
      <div className="flex flex-col items-center gap-8 md:flex-row">
        {!currentUser.avatar && (
          <div
            className={`flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gray-100 p-2 dark:bg-gray-600`}
          >
            <EmptyAvatar size="xl" />
          </div>
        )}
        {currentUser.avatar && <Avatar currentUser={currentUser} size="big" />}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-start gap-2">
            <Input
              id="avatar"
              type="file"
              disabled={isLoading}
              accept="image/png, image/jpg, image/jpeg"
              autoComplete="on"
              placeholder="test"
              {...register("avatar")}
            />
            {isDirty && (
              <Button
                disabled={isLoading || !isDirty}
                isLoading={isLoading}
                type="success"
                component="button"
              >
                Lưu
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}

export default AvatarForm;
