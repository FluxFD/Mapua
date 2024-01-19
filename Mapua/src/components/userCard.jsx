import { Button, Card, CardContent, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const userCard = () => {
  return (
    <Card
      elevation={3}
      sx={{ display: "space-between", marginBottom: 3 }}
    >
      <CardContent>
        <AccountCircleIcon sx={{ fontSize: 50 }} />
      </CardContent>
      <CardContent>
        <Typography
          variant="h6"
          component="div"
        >
          UserName
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          StudentNumber
        </Typography>
      </CardContent>
      <CardContent>
        <Button variant="contained">View Profile</Button>
      </CardContent>
    </Card>
  );
};

export default userCard;
