package com.spamtonneo.snake;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // [核心修复] 告诉 Android 不要让系统栏占用布局空间，让网页铺满全屏
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        // [可选] 如果你希望状态栏的图标（时间、电量）是白色的，加上这句
        WindowInsetsControllerCompat windowInsetsController =
                WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        if (windowInsetsController != null) {
            // 允许内容延伸到状态栏和导航栏下方，并设置状态栏图标为亮色（适配暗黑背景）
            windowInsetsController.setAppearanceLightStatusBars(false);
            windowInsetsController.setAppearanceLightNavigationBars(false);
        }
    }
}