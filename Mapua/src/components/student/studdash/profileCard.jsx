import * as React from "react";
import { Skeleton, Stack, Box } from "@mui/material";

export default function ProfileCard() {
  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={1} direction="row">
        {/* For variant="text", adjust the height via font-size */}

        {/* For other variants, adjust the size with `width` and `height` */}
        <Skeleton variant="circular" width={100} height={100} />
        <Stack spacing={1}>
          <Skeleton variant="rectangular" width={300} height={60} />
          <Skeleton variant="rounded" width={300} height={30} />
        </Stack>
      </Stack>
    </Box>
  );
}
