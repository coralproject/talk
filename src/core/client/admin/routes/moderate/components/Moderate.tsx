import React, { StatelessComponent } from "react";

import MainLayout from "talk-admin/components/MainLayout";
import {
  BaseButton,
  Button,
  Card,
  Counter,
  Flex,
  HorizontalGutter,
  Icon,
  Marker,
  Typography,
} from "talk-ui/components";
import { Navigation, NavigationItem, SubBar } from "talk-ui/components/SubBar";

import InReplyTo from "./InReplyTo";
import styles from "./Moderate.css";
import Timestamp from "./Timestamp";
import Username from "./Username";

const Moderate: StatelessComponent = () => (
  <>
    <SubBar>
      <Navigation>
        <NavigationItem active>
          <Icon>flag</Icon>
          <span>Reported</span>
          <Counter color="primary">20</Counter>
        </NavigationItem>
        <NavigationItem>
          <Icon>access_time</Icon>
          <span>Pending</span>
          <Counter>100</Counter>
        </NavigationItem>
        <NavigationItem>
          <Icon>forum</Icon>
          <span>Unmoderated</span>
          <Counter>2.3k</Counter>
        </NavigationItem>
        <NavigationItem>
          <Icon>cancel</Icon>
          <span>Rejected</span>
        </NavigationItem>
      </Navigation>
    </SubBar>
    <div className={styles.background} />
    <MainLayout>
      <main className={styles.main}>
        <HorizontalGutter className={styles.modQueue} size="double">
          <Card>
            <Flex>
              <div>
                <div className={styles.topBar}>
                  <div>
                    <Username className={styles.username}>
                      SourCatchKids
                    </Username>
                    <Timestamp>1995-12-17T03:24:00.000Z</Timestamp>
                  </div>
                  <div>
                    <InReplyTo>CheapestSeats</InReplyTo>
                  </div>
                </div>
                <Typography className={styles.content}>
                  Design design design simple wanderlust, webdesign design
                  Travel theme pretty wanderlust organized. Darn fun blogger
                  adventure design simple adventure expedition. Webdesign
                  website WordPress excursion, expedition colorful organized
                  organized WordPress wanderlust.
                </Typography>
                <div className={styles.footer}>
                  <Flex justifyContent="flex-end">
                    <Button variant="underlined" color="primary">
                      View Context <Icon>arrow_forward</Icon>
                    </Button>
                  </Flex>
                  <Flex itemGutter>
                    <Marker color="error">Spam</Marker>
                    <Marker color="error">Suspect Word</Marker>
                  </Flex>
                </div>
              </div>
              <div className={styles.separator} />
              <Flex
                className={styles.aside}
                alignItems="center"
                direction="column"
                itemGutter
              >
                <div className={styles.decision}>DECISION</div>
                <Flex itemGutter>
                  <BaseButton className={styles.reject}>
                    <Icon size="lg" className={styles.icon}>
                      close
                    </Icon>
                  </BaseButton>
                  <BaseButton className={styles.approve}>
                    <Icon size="lg" className={styles.icon}>
                      done
                    </Icon>
                  </BaseButton>
                </Flex>
              </Flex>
            </Flex>
          </Card>
          <Card>
            <Flex>
              <div>
                <div className={styles.topBar}>
                  <div>
                    <Username className={styles.username}>
                      SourCatchKids
                    </Username>
                    <Timestamp>1995-12-17T03:24:00.000Z</Timestamp>
                  </div>
                  <div>
                    <InReplyTo>CheapestSeats</InReplyTo>
                  </div>
                </div>
                <Typography className={styles.content}>
                  And yet in Florida not a shred of evidence of a ballot being
                  destroyed or created fraudulently. Meanwhile here I think
                  we're up to 6 sworn affidavits and essentially know who the
                  perpetrator is already.
                </Typography>
                <div className={styles.footer}>
                  <Flex justifyContent="flex-end">
                    <Button variant="underlined" color="primary">
                      View Context <Icon>arrow_forward</Icon>
                    </Button>
                  </Flex>
                </div>
              </div>
              <div className={styles.separator} />
              <Flex
                className={styles.aside}
                alignItems="center"
                direction="column"
                itemGutter
              >
                <div className={styles.decision}>DECISION</div>
                <Flex itemGutter>
                  <BaseButton className={styles.reject}>
                    <Icon size="lg" className={styles.icon}>
                      close
                    </Icon>
                  </BaseButton>
                  <BaseButton className={styles.approve}>
                    <Icon size="lg" className={styles.icon}>
                      done
                    </Icon>
                  </BaseButton>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </HorizontalGutter>
      </main>
    </MainLayout>
  </>
);

export default Moderate;
