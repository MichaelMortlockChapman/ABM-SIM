import { Paper } from "@mui/material"

export default function PaperContainer(props) {
  return (
    <Paper sx={{
      width: '80vw',
      maxWidth: '780px',
      margin: '15px',
      padding: '20px',
      ...props.style
    }}>
      {props.children}
    </Paper>
  )
}