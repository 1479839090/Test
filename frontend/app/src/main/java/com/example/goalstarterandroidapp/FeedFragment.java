package com.example.goalstarterandroidapp;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Parcelable;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;


public class FeedFragment extends Fragment {

//    // TODO: Rename parameter arguments, choose names that match
//    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
//    private static final String ARG_PARAM1 = "param1";
//    private static final String ARG_PARAM2 = "param2";
//
//    // TODO: Rename and change types of parameters
//    private String mParam1;
//    private String mParam2;
//
//    public FeedFragment() {
//        // Required empty public constructor
//    }
//
//    /**
//     * Use this factory method to create a new instance of
//     * this fragment using the provided parameters.
//     *
//     * @param param1 Parameter 1.
//     * @param param2 Parameter 2.
//     * @return A new instance of fragment FeedFragment.
//     */
//    // TODO: Rename and change types and number of parameters
//    public static FeedFragment newInstance(String param1, String param2) {
//        FeedFragment fragment = new FeedFragment();
//        Bundle args = new Bundle();
//        args.putString(ARG_PARAM1, param1);
//        args.putString(ARG_PARAM2, param2);
//        fragment.setArguments(args);
//        return fragment;
//    }

    private static final String LOGTAG  = "FEED FRAGMENT LOG TAG";
    private RequestQueue mQueue;

    private RecyclerView mRecyclerView;

    // parent activity
    private HostActivity parentActivity;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        parentActivity = (HostActivity) getActivity();

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_feed, container, false);

        // floating action button
        view.findViewById(R.id.fab_feed_fragment).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getContext(), CreateGoalActivity.class);
                startActivity(intent);
            }
        });

        // recycler view
        mRecyclerView = view.findViewById(R.id.recycler_view_feed_fragment);
        // set layout manager for recycler view
        mRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        // set recycler view adapter
        parentActivity.getFeedAdapter();

        // add padding to the bottom of recycler view
        BottomOffsetDecoration bottomOffsetDecoration = new BottomOffsetDecoration((int)(80 * getResources().getDisplayMetrics().density));
        mRecyclerView.addItemDecoration(bottomOffsetDecoration);

        return view;
    }

    public void attachAdapter(GoalCardRecycleViewAdapter adapter){
        mRecyclerView.setAdapter(adapter);
    }
}