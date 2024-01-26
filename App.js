/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  ANDROID_DATABASE_PATH,
  BatchQueryResult,
  FileLoadResult,
  IOS_LIBRARY_PATH,
  open,
  PreparedStatementObj,
  QueryResult,
  SQLBatchTuple,
  Transaction,
  UpdateHookOperation,
} from '@op-engineering/op-sqlcipher';

let DB_CONNECT = null;
export const DB_NAME = 'app_op.db';
export function openAppDB() {
  if (DB_CONNECT == null) {
    DB_CONNECT = open({
      name: DB_NAME,
      location:
        Platform.OS === 'ios' ? IOS_LIBRARY_PATH : ANDROID_DATABASE_PATH,
      encryptionKey: 'WaLong_SaleApp',
    });
  }
  return DB_CONNECT;
}

export function closeAppDB() {
  if (DB_CONNECT != null) {
    try {
      DB_CONNECT.close();
    } catch (e) {
      console.log(`close saleApp error : ${e.toString()}`);
    }
  }
}

/***
 * 初始化sqlite数据库建表，在启动时执行，没有的表进行创建
 * @returns {Promise<void>}
 */
export async function initCreateTables() {
  const db = openAppDB();
  // pdtu.csv
  const createPdtUserSQL =
    "CREATE TABLE IF NOT EXISTS 'user'('sync_id' VARCHAR(20) NOT NULL PRIMARY KEY, 'uid' VARCHAR(20) NOT NULL DEFAULT '', 'password' VARCHAR(30) NOT NULL DEFAULT '', 'first_name' VARCHAR(30) NOT NULL DEFAULT '', 'last_name' VARCHAR(30) NOT NULL DEFAULT '', 'user_type' VARCHAR(30) NOT NULL DEFAULT '' );";
  const createPdtUserIndexSQL =
    "CREATE INDEX IF NOT EXISTS 'UID_INDEX' ON 'pdt_user' ('uid')";

  // 创建表
  db.execute(createPdtUserSQL);
  // 创建索引
  db.execute(createPdtUserIndexSQL);
}

function Section({children, title}) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    initCreateTables()
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
