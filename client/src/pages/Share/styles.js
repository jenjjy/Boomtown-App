const styles = theme => ({
  flexForm: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: 950,
    margin: 'auto',
    padding: '5% 0'
  },
  shareForm: {
    alignSelf: 'center',
    padding: 12,
    maxWidth: 420,
    width: '100%'
  },
  sharePreview: {
    padding: 12,
    maxWidth: 400,
    width: '100%',

    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  }
});

export default styles;
