import Header from "@/components/header";

import '../globals.css'
import styles from "./styles.module.css";

export const metaData = {
  title: 'Infinite Text Advs.',
  description: 'Play an infinite amount of various text adventures',
  opengraph: {
    title: 'Infinite Text Adventures!',
    description: 'Play an infinite amount of various text adventures',
    sitename: 'infinitetextadventures.app',
    images: [{

    }]
  }

}

const Layout = ({ children }: { children: React.ReactNode }) => {
  
  return (
    <html>
      <body>
        <Header />
        <div className={styles.rowContainer}>{children}</div>
      </body>
    </html>
  );
};

export default Layout;
