import { Card, Image, Typography } from "antd";
import React from "react";
import { ThemeInVenueDataResponse } from "src/dtos/response/theme.response";
const { Meta } = Card;

const ThemeInVenueDetail = ({
  themeInVenue,
}: {
  themeInVenue?: ThemeInVenueDataResponse;
}) => {
  return (
    <>
      <Image
        alt="example"
        src={themeInVenue?.theme?.themeImgUrl}
        width={"100%"}
        height={350}
        style={{ objectFit: "cover" }}
      />
      <Typography.Title level={3}>
        {themeInVenue?.theme?.themeName}
      </Typography.Title>
    </>
  );
};

export default ThemeInVenueDetail;
